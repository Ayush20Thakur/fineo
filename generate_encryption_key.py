#!/usr/bin/env python3
"""
Generate a secure encryption key for the private ledger
"""

from cryptography.fernet import Fernet
import base64
import os

def generate_encryption_key():
    """Generate a secure encryption key"""
    key = Fernet.generate_key()
    return key.decode('utf-8')

def generate_salt():
    """Generate a secure salt"""
    salt = os.urandom(32)
    return base64.b64encode(salt).decode('utf-8')

if __name__ == "__main__":
    print("🔐 Generating secure encryption keys for Fineo...")
    print()
    
    encryption_key = generate_encryption_key()
    salt = generate_salt()
    
    print("Add these to your .env file:")
    print("=" * 50)
    print(f"PRIVATE_LEDGER_SALT={salt}")
    print(f"PRIVATE_LEDGER_ENC_KEY={encryption_key}")
    print("=" * 50)
    print()
    print("⚠️  IMPORTANT: Keep these keys secure and never share them publicly!")
    print("💡 For production, use different keys than development")
