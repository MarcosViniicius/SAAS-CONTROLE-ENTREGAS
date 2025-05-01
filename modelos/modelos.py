from  flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime

db = SQLAlchemy()

class Empresa(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    
    # Relacionamentos
    usuarios = db.relationship('Usuario', backref='empresa', lazy=True)
    entregadores = db.relationship('Entregador', backref='empresa', lazy=True)
    entregas = db.relationship('Entrega', backref='empresa', lazy=True)

class Usuario(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    senha_hash = db.Column(db.String(200), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    
    def __repr__(self):
        return f'<Usuario {self.email}>'

class Entregador(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    
    # Relacionamentos
    entregas = db.relationship('Entrega', backref='entregador', lazy=True)
    
    def __repr__(self):
        return f'<Entregador {self.nome}>'

class Entrega(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    endereco = db.Column(db.String(200), nullable=False)
    valor = db.Column(db.Float, nullable=False)
    forma_pagamento = db.Column(db.String(50), nullable=False)
    observacoes = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='Pendente')
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)
    entregador_id = db.Column(db.Integer, db.ForeignKey('entregador.id'), nullable=False)
    empresa_id = db.Column(db.Integer, db.ForeignKey('empresa.id'), nullable=False)
    
    def __repr__(self):
        return f'<Entrega {self.id} - {self.status}>'
 