from  flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from entregadores.formularios import EntregadorForm
from modelos.modelos import db, Entregador, Entrega

entregadores_bp = Blueprint('entregadores', __name__)

@entregadores_bp.route('/')
@login_required
def listar():
    entregadores = Entregador.query.filter_by(empresa_id=current_user.empresa_id).all()
    return render_template('entregadores/listar.html', entregadores=entregadores)

@entregadores_bp.route('/novo', methods=['GET', 'POST'])
@login_required
def novo():
    form = EntregadorForm()
    
    if form.validate_on_submit():
        entregador = Entregador(
            nome=form.nome.data,
            empresa_id=current_user.empresa_id
        )
        db.session.add(entregador)
        db.session.commit()
        
        flash('Entregador cadastrado com sucesso!', 'success')
        return redirect(url_for('entregadores.listar'))
    
    return render_template('entregadores/form.html', form=form, titulo='Novo Entregador')

@entregadores_bp.route('/editar/<int:id>', methods=['GET', 'POST'])
@login_required
def editar(id):
    # Obter o entregador pelo ID, verificando se pertence à empresa do usuário
    entregador = Entregador.query.filter_by(
        id=id, 
        empresa_id=current_user.empresa_id
    ).first_or_404()
    
    form = EntregadorForm(obj=entregador)
    
    if form.validate_on_submit():
        entregador.nome = form.nome.data
        db.session.commit()
        
        flash('Entregador atualizado com sucesso!', 'success')
        return redirect(url_for('entregadores.listar'))
    
    return render_template('entregadores/form.html', form=form, titulo='Editar Entregador')

@entregadores_bp.route('/excluir/<int:id>', methods=['POST'])
@login_required
def excluir(id):
    # Obter o entregador pelo ID, verificando se pertence à empresa do usuário
    entregador = Entregador.query.filter_by(
        id=id, 
        empresa_id=current_user.empresa_id
    ).first_or_404()
    
    # Verificar se existem entregas associadas ao entregador
    entregas_associadas = Entrega.query.filter_by(entregador_id=id).count()
    
    if entregas_associadas > 0:
        flash(f'Não é possível excluir este entregador pois existem {entregas_associadas} entregas associadas a ele.', 'danger')
    else:
        db.session.delete(entregador)
        db.session.commit()
        flash('Entregador excluído com sucesso!', 'success')
    
    return redirect(url_for('entregadores.listar'))
 