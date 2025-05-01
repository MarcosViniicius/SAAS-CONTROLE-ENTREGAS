from  flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from entregas.formularios import EntregaForm, FiltroHistoricoForm
from modelos.modelos import db, Entrega, Entregador

entregas_bp = Blueprint('entregas', __name__)

FORMAS_PAGAMENTO = ['Dinheiro', 'Cartão', 'Pix', 'Outro']
STATUS_ENTREGAS = ['Pendente', 'Em Rota', 'Concluída', 'Cancelada']

@entregas_bp.route('/')
@login_required
def listar():
    # Buscar apenas entregas pendentes e em rota
    entregas = Entrega.query.filter(
        Entrega.empresa_id == current_user.empresa_id,
        Entrega.status.in_(['Pendente', 'Em Rota'])
    ).all()
    
    return render_template('entregas/listar.html', entregas=entregas)

@entregas_bp.route('/novo', methods=['GET', 'POST'])
@login_required
def novo():
    # Buscar entregadores da empresa do usuário
    entregadores = Entregador.query.filter_by(empresa_id=current_user.empresa_id).all()
    
    # Verificar se há entregadores cadastrados
    if not entregadores:
        flash('Você precisa cadastrar pelo menos um entregador antes de criar entregas.', 'warning')
        return redirect(url_for('entregadores.novo'))
    
    form = EntregaForm()
    
    # Preencher as opções de entregadores e formas de pagamento
    form.entregador_id.choices = [(e.id, e.nome) for e in entregadores]
    form.forma_pagamento.choices = [(fp, fp) for fp in FORMAS_PAGAMENTO]
    
    if form.validate_on_submit():
        entrega = Entrega(
            endereco=form.endereco.data,
            valor=form.valor.data,
            forma_pagamento=form.forma_pagamento.data,
            observacoes=form.observacoes.data,
            status='Pendente',  # Status inicial sempre é pendente
            entregador_id=form.entregador_id.data,
            empresa_id=current_user.empresa_id
        )
        db.session.add(entrega)
        db.session.commit()
        
        flash('Entrega registrada com sucesso!', 'success')
        return redirect(url_for('entregas.listar'))
    
    return render_template('entregas/form.html', form=form, titulo='Nova Entrega', entregadores=entregadores)

@entregas_bp.route('/editar/<int:id>', methods=['GET', 'POST'])
@login_required
def editar(id):
    # Obter a entrega pelo ID, verificando se pertence à empresa do usuário
    entrega = Entrega.query.filter_by(
        id=id, 
        empresa_id=current_user.empresa_id
    ).first_or_404()
    
    # Buscar entregadores da empresa do usuário
    entregadores = Entregador.query.filter_by(empresa_id=current_user.empresa_id).all()
    
    form = EntregaForm(obj=entrega)
    
    # Preencher as opções de entregadores, formas de pagamento e status
    form.entregador_id.choices = [(e.id, e.nome) for e in entregadores]
    form.forma_pagamento.choices = [(fp, fp) for fp in FORMAS_PAGAMENTO]
    form.status.choices = [(s, s) for s in STATUS_ENTREGAS]
    
    if form.validate_on_submit():
        entrega.endereco = form.endereco.data
        entrega.valor = form.valor.data
        entrega.forma_pagamento = form.forma_pagamento.data
        entrega.observacoes = form.observacoes.data
        entrega.status = form.status.data
        entrega.entregador_id = form.entregador_id.data
        
        db.session.commit()
        
        flash('Entrega atualizada com sucesso!', 'success')
        
        # Redirecionar para a lista correta com base no status
        if entrega.status in ['Pendente', 'Em Rota']:
            return redirect(url_for('entregas.listar'))
        else:
            return redirect(url_for('entregas.historico'))
    
    return render_template('entregas/form.html', form=form, titulo='Editar Entrega', entregadores=entregadores, entrega=entrega)

@entregas_bp.route('/status/<int:id>/<status>', methods=['POST'])
@login_required
def atualizar_status(id, status):
    # Verificar se o status é válido
    if status not in STATUS_ENTREGAS:
        flash('Status inválido!', 'danger')
        return redirect(url_for('entregas.listar'))
    
    # Obter a entrega pelo ID, verificando se pertence à empresa do usuário
    entrega = Entrega.query.filter_by(
        id=id, 
        empresa_id=current_user.empresa_id
    ).first_or_404()
    
    entrega.status = status
    db.session.commit()
    
    flash(f'Status da entrega atualizado para {status}!', 'success')
    
    # Redirecionar para a página anterior
    return redirect(request.referrer or url_for('entregas.listar'))

@entregas_bp.route('/historico', methods=['GET', 'POST'])
@login_required
def historico():
    form = FiltroHistoricoForm()
    
    # Preencher as opções de entregadores
    entregadores = Entregador.query.filter_by(empresa_id=current_user.empresa_id).all()
    form.entregador_id.choices = [(0, 'Todos os entregadores')] + [(e.id, e.nome) for e in entregadores]
    
    # Definir filtros padrão
    status_filtro = request.args.getlist('status') or ['Concluída', 'Cancelada']
    entregador_id = request.args.get('entregador_id', '0')
    
    # Aplicar valores dos parâmetros ao formulário
    form.status.data = status_filtro
    form.entregador_id.data = entregador_id
    
    # Construir a query base
    query = Entrega.query.filter(
        Entrega.empresa_id == current_user.empresa_id,
        Entrega.status.in_(status_filtro)
    )
    
    # Filtrar por entregador se especificado
    if entregador_id != '0':
        query = query.filter(Entrega.entregador_id == int(entregador_id))
    
    # Executar a query
    entregas = query.order_by(Entrega.id.desc()).all()
    
    return render_template(
        'entregas/historico.html', 
        entregas=entregas, 
        form=form,
        status_filtro=status_filtro
    )
