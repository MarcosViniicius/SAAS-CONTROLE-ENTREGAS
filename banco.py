from  modelos.modelos import db, Empresa, Usuario, Entregador, Entrega
from werkzeug.security import generate_password_hash
import os

def inicializar_db(app):
    # Verificar se o banco de dados já existe
    db_exists = os.path.exists('sistema_entregas.db')
    
    # Criar as tabelas do banco de dados
    with app.app_context():
        db.create_all()
        
        # Se o banco não existia, criar dados iniciais para teste
        if not db_exists:
            criar_dados_teste()

def criar_dados_teste():
    # Criar empresa de exemplo
    empresa = Empresa(
        nome='Entregas Rápidas Ltda',
        email='contato@entregasrapidas.com'
    )
    db.session.add(empresa)
    db.session.commit()
    
    # Criar usuário de exemplo
    usuario = Usuario(
        email='admin@entregasrapidas.com',
        senha_hash=generate_password_hash('123456'),
        empresa_id=empresa.id
    )
    db.session.add(usuario)
    db.session.commit()
    
    # Criar entregadores de exemplo
    entregadores = [
        Entregador(nome='João Silva', empresa_id=empresa.id),
        Entregador(nome='Maria Souza', empresa_id=empresa.id),
        Entregador(nome='Pedro Oliveira', empresa_id=empresa.id)
    ]
    db.session.add_all(entregadores)
    db.session.commit()
    
    # Criar entregas de exemplo
    entregas = [
        Entrega(
            endereco='Rua das Flores, 123',
            valor=45.90,
            forma_pagamento='Dinheiro',
            observacoes='Entregar na portaria',
            status='Pendente',
            entregador_id=entregadores[0].id,
            empresa_id=empresa.id
        ),
        Entrega(
            endereco='Av. Paulista, 1000',
            valor=78.50,
            forma_pagamento='Cartão',
            observacoes='Apartamento 501',
            status='Em Rota',
            entregador_id=entregadores[1].id,
            empresa_id=empresa.id
        ),
        Entrega(
            endereco='Rua Augusta, 500',
            valor=32.00,
            forma_pagamento='Pix',
            observacoes='',
            status='Concluída',
            entregador_id=entregadores[2].id,
            empresa_id=empresa.id
        ),
        Entrega(
            endereco='Alameda Santos, 45',
            valor=120.00,
            forma_pagamento='Dinheiro',
            observacoes='Cliente não atende telefone',
            status='Cancelada',
            entregador_id=entregadores[0].id,
            empresa_id=empresa.id
        )
    ]
    db.session.add_all(entregas)
    db.session.commit()
    
    print("Dados de teste criados com sucesso!")
 