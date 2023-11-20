from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import pandas as pd
import search
import json

def init_sheet():
    scopes = ['https://www.googleapis.com/auth/spreadsheets']
    creds = Credentials.from_service_account_file('credentials.json', scopes=scopes)
    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    return sheet

def append_to_sheet(sheet, sheet_id, data, sheet_name='Sheet1'):
    result = sheet.values().get(spreadsheetId=sheet_id, range=f"{sheet_name}").execute()
    values = result.get('values', [])
    last_row = len(values)
    
    range_to_update = f"{sheet_name}!A{last_row + 1}"
    body = {'values': [data]}
    print(f"range_to_update: {range_to_update} with body: {body}")
    result = sheet.values().update(
        spreadsheetId=sheet_id,
        range=range_to_update,
        body=body,
        valueInputOption="RAW"
    ).execute()
    return result

def sheet_to_dataframe(sheet, sheet_id, sheet_name='Sheet1'):
    result = sheet.values().get(spreadsheetId=sheet_id, range=f"{sheet_name}").execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
        return None

    # NOTE: only take first 4 columns as we currently don't use the other columns when searching
    header = values[0][:4]
    data = values[1:]

    df = pd.DataFrame(data, columns=header)
    return df

def add_embeddings(sheet, sheet_id, sheet_name='Sheet1'):
    result = sheet.values().get(spreadsheetId=sheet_id, range=f"{sheet_name}").execute()
    values = result.get('values', [])

    if len(values) > 0 and len(values[0]) > 1:
        for i, row in enumerate(values):
            if i == 0 or i > 197:
                continue
            print(row)
            prompt = row[0]  
            if prompt: 
                embedding = search.get_embedding(prompt) 
                row[2] = str(embedding)

    body = {'values': values}
    result = sheet.values().update(spreadsheetId=sheet_id, range=f"{sheet_name}", body=body, valueInputOption='RAW').execute()
    return result

# Store embeddings for all prompts one off
# Each time we store in database, we add embedding to json
# In search package, we load embeddings from json to use in query function

# Add embeddings to json
def add_embeddings_to_json(sheet, sheet_id, sheet_name='Sheet1'):
    result = sheet.values().get(spreadsheetId=sheet_id, range=f"{sheet_name}").execute()
    values = result.get('values', [])
    embedding_dict = {}

    if len(values) > 0 and len(values[0]) > 1:
        for i, row in enumerate(values):
            if i == 0 or i > 197:
                continue
            prompt = row[0]  
            if prompt: 
                embedding = search.get_embedding(prompt) 
                embedding_dict[prompt] = embedding.tolist()

    with open('embeddings.json', 'w') as f:
        json.dump(embedding_dict, f)

if __name__ == '__main__':
    ## for testing in isolation of server
    pass
