from  flask_wtf import FlaskForm
from wtforms import StringField, SubmitField
from wtforms.validators import DataRequired

class EntregadorForm(FlaskForm):
    nome = StringField('Nome do Entregador', validators=[DataRequired()])
    submit = SubmitField('Salvar')
 