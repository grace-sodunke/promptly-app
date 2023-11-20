import os
import gspread
from oauth2client.service_account import ServiceAccountCredentials

GOOGLE_SHEET_ID = "1fcwidJ63I5zp6kmHW2PCAGnM6ykgs-6FZ2iH1owGeXI"
# GOOGLE_API_KEY = os.getenv("PROMPTLY_GOOGLE_KEY")


scope = ['https://spreadsheets.google.com/feeds','https://www.googleapis.com/auth/drive']
credentials = ServiceAccountCredentials.from_json_keyfile_name('promptly-398920-4e087ae7591f.json', scope)
gc = gspread.authorize(credentials)

def read_prompt_library():
    # Open the Google Sheet using the provided Sheet ID and get values
    worksheet = gc.open_by_key(GOOGLE_SHEET_ID).sheet1
    data = worksheet.get_all_values()
    headers = data.pop(0)
    for row in data:
        print(row)
    return data
def get_all_prompts():
    worksheet = gc.open_by_key(GOOGLE_SHEET_ID).sheet1
    data = worksheet.get_all_values()
    headers = data.pop(0)
    prompts = []
    for row in data:
        prompts.append(row[0])
    return prompts

if __name__ == '__main__':
    data = get_all_prompts()
    print(data)
