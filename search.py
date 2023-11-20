from sentence_transformers import SentenceTransformer
import numpy as np
import pandas as pd
import sheet_api

model = SentenceTransformer('all-MiniLM-L6-v2')

# Return the top 2 prompt suggestions based on user's initial query
def query(prompt: dict, data: pd.DataFrame, top_k = 2) -> pd.DataFrame:
    result = data[['prompt', 'embedding']].copy()
    # remove all rows with None values
    result = result.dropna(subset=['prompt', 'embedding'])
    # remove all rows with empty prompt or embedding
    result = result[result['embedding'] != '']
    result = result[result['prompt'] != '']

    np_gsheet_embeddings = np.array([np.fromstring(embedding[1:-1], dtype=np.float32, sep=" ") for embedding in result['embedding'].values])
    query_embedding = model.encode(prompt['prompt'])

    # Calculate the cosine similarity between the query_embedding and all embeddings both are numpy arrays
    # cos_sim = util.cos_sim(np_gsheet_embeddings, query_embedding) #NOTE: previous way of calculating it
    dot_products = np.dot(np_gsheet_embeddings, query_embedding)
    embedding_norms = np.linalg.norm(np_gsheet_embeddings, axis=1) * np.linalg.norm(query_embedding)
    cos_sim = dot_products / embedding_norms

    sorted_indices = np.argsort(cos_sim)[::-1]
    # Return the top_k prompt suggestions
    top_k_results = result.iloc[sorted_indices[:top_k]]

    return top_k_results['prompt']


def get_embedding(prompt: str) -> np.ndarray:
    return model.encode(prompt)

if __name__ == "__main__":
    incoming_data = {
    "prompt": "write me a report for my school on the book 'The Great Gatsby' by F. Scott Fitzgerald",
    "age_range": "20-30",
    "location": "London"}

    incoming_data_2 = {
    "prompt": "help me make a meal with tomatoes, onions, and chicken without using the oven or microwave that will take less than 30 minutes to make",
    "age_range": "20-30",
    "location": "London"}

    sheet = sheet_api.init_sheet()
    sheet_id = '1fcwidJ63I5zp6kmHW2PCAGnM6ykgs-6FZ2iH1owGeXI'
    print(query(incoming_data, sheet_api.sheet_to_dataframe(sheet, sheet_id)))
    # print(f"-------------------")
    # print(query(incoming_data_2, sheet_api.sheet_to_dataframe(sheet, sheet_id)))


