import hashlib
import json
import sqlite3
from time import time
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'neurochain_ledger.db')

class Block:
    def __init__(self, index, timestamp, prediction_result, explanation, previous_hash, hash=None, nonce=0):
        self.index = index
        self.timestamp = timestamp
        # Payload data
        self.prediction_result = prediction_result 
        self.explanation = explanation
        
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = hash if hash else self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "prediction_result": self.prediction_result,
            "explanation": self.explanation,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty):
        target = '0' * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "prediction_result": self.prediction_result,
            "explanation": self.explanation,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "nonce": self.nonce
        }


class Blockchain:
    def __init__(self):
        self.difficulty = 2
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS blocks (
                    "index" INTEGER PRIMARY KEY,
                    timestamp REAL,
                    prediction_result TEXT,
                    explanation TEXT,
                    previous_hash TEXT,
                    hash TEXT,
                    nonce INTEGER
                )
            ''')
            # Check if genesis block exists
            cursor.execute('SELECT COUNT(*) FROM blocks')
            if cursor.fetchone()[0] == 0:
                genesis_block = Block(0, time(), "System Initialized", "Genesis Block", "0")
                self._save_block(genesis_block, cursor)
            conn.commit()

    def _save_block(self, block, cursor):
        cursor.execute('''
            INSERT INTO blocks ("index", timestamp, prediction_result, explanation, previous_hash, hash, nonce)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            block.index, block.timestamp, block.prediction_result, 
            block.explanation, block.previous_hash, block.hash, block.nonce
        ))

    def get_latest_block(self):
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM blocks ORDER BY "index" DESC LIMIT 1')
            row = cursor.fetchone()
            if row:
                return Block(*row)
            return None

    def get_all_blocks(self):
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM blocks ORDER BY "index" ASC')
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    def add_block(self, prediction_result, explanation):
        latest_block = self.get_latest_block()
        new_block = Block(
            index=latest_block.index + 1,
            timestamp=time(),
            prediction_result=prediction_result,
            explanation=explanation,
            previous_hash=latest_block.hash
        )
        new_block.mine_block(self.difficulty)
        
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            self._save_block(new_block, cursor)
            conn.commit()
            
        return new_block

    def is_chain_valid(self):
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM blocks ORDER BY "index" ASC')
            rows = cursor.fetchall()
            
        blocks = [Block(*row) for row in rows]
            
        for i in range(1, len(blocks)):
            current_block = blocks[i]
            previous_block = blocks[i - 1]

            # Recalculate hash and check
            if current_block.hash != current_block.calculate_hash():
                return False

            # Check if previous hash matches
            if current_block.previous_hash != previous_block.hash:
                return False

        return True
