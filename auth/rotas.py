from  flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from auth.formularios import LoginForm, RegistroForm
from modelos.modelos import db, Usuario, Empresa

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    # Redirecionar se o usuário já estiver logado
    if current_user.is_authenticated:
        return redirect(url_for('painel'))
    
    form = LoginForm()
    
    if form.validate_on_submit():
        email = form.email.data
        senha = form.senha.data
        
        usuario = Usuario.query.filter_by(email=email).first()
        
        if usuario and check_password_hash(usuario.senha_hash, senha):
            login_user(usuario)
            next_page = request.args.get('next')
            return redirect(next_page or url_for('painel'))
        else:
            flash('Email ou senha incorretos. Por favor, tente novamente.', 'danger')
    
    return render_template('login.html', form=form)

@auth_bp.route('/registro', methods=['GET', 'POST'])
def registro():
    # Redirecionar se o usuário já estiver logado
    if current_user.is_authenticated:
        return redirect(url_for('painel'))
    
    form = RegistroForm()
    
    if form.validate_on_submit():
        # Verificar se o email já está em uso
        if Usuario.query.filter_by(email=form.email.data).first():
            flash('Este email já está em uso.', 'danger')
            return render_template('registro.html', form=form)
        
        # Criar nova empresa
        nova_empresa = Empresa(
            nome=form.nome_empresa.data,
            email=form.email.data
        )
        db.session.add(nova_empresa)
        db.session.commit()
        
        # Criar novo usuário
        novo_usuario = Usuario(
            email=form.email.data,
            senha_hash=generate_password_hash(form.senha.data),
            empresa_id=nova_empresa.id
        )
        db.session.add(novo_usuario)
        db.session.commit()
        
        flash('Cadastro realizado com sucesso! Por favor, faça login.', 'success')
        return redirect(url_for('auth.login'))
    
    return render_template('registro.html', form=form)

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Você saiu do sistema.', 'info')
    return redirect(url_for('auth.login'))
 