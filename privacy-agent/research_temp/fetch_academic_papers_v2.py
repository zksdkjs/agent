#!/usr/bin/env python3

import requests
import feedparser
import time

def fetch_recent_zkp_papers():
    """Fetch recent academic papers on zero-knowledge proofs from arXiv using API"""
    # Search for recent ZKP papers
    search_query = "zero+knowledge+proof+OR+zkp+OR+zk-snark+OR+zk-stark"
    url = f"http://export.arxiv.org/api/query?search_query=all:{search_query}&sortBy=lastUpdated&sortOrder=descending&max_results=5"
    
    try:
        response = requests.get(url)
        feed = feedparser.parse(response.content)
        
        papers = []
        for entry in feed.entries:
            paper = {
                'title': entry.title,
                'authors': ', '.join([author.name for author in entry.authors]) if hasattr(entry, 'authors') else 'N/A',
                'summary': entry.summary[:300] + "..." if len(entry.summary) > 300 else entry.summary,
                'published': entry.published if hasattr(entry, 'published') else 'N/A',
                'id': entry.id
            }
            papers.append(paper)
            
        return papers
    except Exception as e:
        return f"Error fetching papers: {str(e)}"

def fetch_recent_privacy_papers():
    """Fetch recent privacy-related papers from arXiv"""
    search_query = "privacy+enhancing+OR+cryptographic+OR+homomorphic+OR+MPC"
    url = f"http://export.arxiv.org/api/query?search_query=all:{search_query}&sortBy=lastUpdated&sortOrder=descending&max_results=5"
    
    try:
        response = requests.get(url)
        feed = feedparser.parse(response.content)
        
        papers = []
        for entry in feed.entries:
            paper = {
                'title': entry.title,
                'authors': ', '.join([author.name for author in entry.authors]) if hasattr(entry, 'authors') else 'N/A',
                'summary': entry.summary[:300] + "..." if len(entry.summary) > 300 else entry.summary,
                'published': entry.published if hasattr(entry, 'published') else 'N/A',
                'id': entry.id
            }
            papers.append(paper)
            
        return papers
    except Exception as e:
        return f"Error fetching privacy papers: {str(e)}"

if __name__ == "__main__":
    print("Recent Zero-Knowledge Proof Papers from arXiv:")
    print("=" * 50)
    zkp_papers = fetch_recent_zkp_papers()
    if isinstance(zkp_papers, list):
        for i, paper in enumerate(zkp_papers, 1):
            print(f"{i}. {paper['title']}")
            print(f"   Authors: {paper['authors']}")
            print(f"   Published: {paper['published']}")
            print(f"   Abstract: {paper['summary']}")
            print(f"   URL: {paper['id']}")
            print()
    else:
        print(zkp_papers)
    
    print("\nRecent Privacy-Enhancing Technology Papers:")
    print("=" * 50)
    privacy_papers = fetch_recent_privacy_papers()
    if isinstance(privacy_papers, list):
        for i, paper in enumerate(privacy_papers, 1):
            print(f"{i}. {paper['title']}")
            print(f"   Authors: {paper['authors']}")
            print(f"   Published: {paper['published']}")
            print(f"   Abstract: {paper['summary']}")
            print(f"   URL: {paper['id']}")
            print()
    else:
        print(privacy_papers)
