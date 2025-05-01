from  flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField, TextAreaField, SubmitField, SelectMultipleField, HiddenField
from wtforms.validators import DataRequired, NumberRange, Optional

class EntregaForm(FlaskForm):
    endereco = StringField('Endereço de Entrega', validators=[DataRequired()])
    valor = FloatField('Valor (R$)', validators=[DataRequired(), NumberRange(min=0.01)])
    forma_pagamento = SelectField('Forma de Pagamento', validators=[DataRequired()], choices=[])
    observacoes = TextAreaField('Observações (opcional)', validators=[Optional()])
    entregador_id = SelectField('Entregador', validators=[DataRequired()], coerce=int, choices=[])
    status = SelectField('Status', validators=[Optional()], default='Pendente', choices=[])
    submit = SubmitField('Salvar')

class FiltroHistoricoForm(FlaskForm):
    status = SelectMultipleField('Status', choices=[
        ('Concluída', 'Concluída'),
        ('Cancelada', 'Cancelada')
    ])
    entregador_id = SelectField('Entregador', coerce=int, choices=[])  # <-- CORRIGIDO
    submit = SubmitField('Filtrar')
