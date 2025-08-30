#!/usr/bin/env python3

import requests
from bs4 import BeautifulSoup
import json

def fetch_recent_zkp_papers():
    """Fetch recent academic papers on zero-knowledge proofs from arXiv"""
    url = "https://arxiv.org/search/?searchtype=all&query=zero+knowledge+proof&abstracts=show&size=5&order=-announced_date_first"
    
    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Find all list items containing paper info
        papers = []
        for item in soup.find_all('li', class_='arxiv-result'):
            title_elem = item.find('p', class_='title')
            authors_elem = item.find('p', class_='authors')
            abstract_elem = item.find('p', class_='abstract')
            arxiv_id = item.find('p', class_='arxiv-id')
            
            paper = {
                'title': title_elem.text.strip() if title_elem else 'N/A',
                'authors': authors_elem.text.strip() if authors_elem else 'N/A',
                'abstract': abstract_elem.text.strip() if abstract_elem else 'N/A',
                'id': arxiv_id.text.strip() if arxiv_id else 'N/A'
            }
            papers.append(paper)
            
        return papers
    except Exception as e:
        return f"Error fetching papers: {str(e)}"

def fetch_recent_crypto_papers():
    """Fetch recent cryptography papers from IACR"""
    try:
        response = requests.get("https://eprint.iacr.org/eprints-latest.html")
        soup = BeautifulSoup(response.content, 'html.parser')
        
        papers = []
        # Get the latest papers
        for item in soup.find_all('div', class_='paper')[:5]:
            title_elem = item.find('h2')
            authors_elem = item.find('p', class_='authors')
            
            paper = {
                'title': title_elem.text.strip() if title_elem else 'N/A',
                'authors': authors_elem.text.strip() if authors_elem else 'N/A'
            }
            papers.append(paper)
            
        return papers
    except Exception as e:
        return f"Error fetching IACR papers: {str(e)}"

if __name__ == "__main__":
    print("Recent Zero-Knowledge Proof Papers from arXiv:")
    print("=" * 50)
    zkp_papers = fetch_recent_zkp_papers()
    if isinstance(zkp_papers, list):
        for i, paper in enumerate(zkp_papers, 1):
            print(f"{i}. {paper['title']}")
            print(f"   Authors: {paper['authors']}")
            print(f"   ID: {paper['id']}")
            print(f"   Abstract: {paper['abstract'][:200]}...")
            print()
    else:
        print(zkp_papers)
