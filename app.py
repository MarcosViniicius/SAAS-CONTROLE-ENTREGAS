from  flask import Flask, render_template, redirect, url_for, flash, request
from flask_login import LoginManager, login_required, current_user, login_user, logout_user
from werkzeug.security import generate_password_hash, check_password_hash
import os
from datetime import datetime

# Importar módulos da aplicação
from auth.rotas import auth_bp
from entregadores.rotas import entregadores_bp
from entregas.rotas import entregas_bp
from modelos.modelos import db, Usuario, Empresa, Entregador, Entrega

# Inicializar a aplicação
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'chave-secreta-padrao')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sistema_entregas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar o banco de dados
db.init_app(app)

# Configurar o gerenciador de login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'
login_manager.login_message = 'Por favor, faça login para acessar esta página.'

@login_manager.user_loader
def load_user(user_id):
    return Usuario.query.get(int(user_id))

# Registrar blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(entregadores_bp, url_prefix='/entregadores')
app.register_blueprint(entregas_bp, url_prefix='/entregas')

# Rota principal
@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('painel'))
    return redirect(url_for('auth.login'))

# Painel de controle
@app.route('/painel')
@login_required
def painel():
    # Obter estatísticas
    empresa_id = current_user.empresa_id
    
    # Contar entregadores
    entregadores_count = Entregador.query.filter_by(empresa_id=empresa_id).count()
    
    # Contar entregas por status
    entregas_pendentes = Entrega.query.filter_by(empresa_id=empresa_id, status='Pendente').count()
    entregas_em_rota = Entrega.query.filter_by(empresa_id=empresa_id, status='Em Rota').count()
    entregas_concluidas = Entrega.query.filter_by(empresa_id=empresa_id, status='Concluída').count()
    entregas_canceladas = Entrega.query.filter_by(empresa_id=empresa_id, status='Cancelada').count()
    
    # Obter entregas recentes
    entregas_recentes = Entrega.query.filter_by(empresa_id=empresa_id).order_by(Entrega.id.desc()).limit(5).all()
    
    # Obter informações da empresa
    empresa = Empresa.query.get(empresa_id)
    
    return render_template('painel.html', 
                           entregadores_count=entregadores_count,
                           entregas_pendentes=entregas_pendentes,
                           entregas_em_rota=entregas_em_rota,
                           entregas_concluidas=entregas_concluidas,
                           entregas_canceladas=entregas_canceladas,
                           entregas_recentes=entregas_recentes,
                           empresa=empresa)

# Função para criar as tabelas do banco
with app.app_context():
    db.create_all()

# Adicionar filtros para formatação de valores
@app.template_filter('format_valor')
def format_valor(value):
    return f"R$ {value:.2f}".replace('.', ',')

@app.before_request
def inicializar():
    # Seu código de inicialização aqui
    pass

# Executar a aplicação
if __name__ == '__main__':
    app.run(debug=True)
