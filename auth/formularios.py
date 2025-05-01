from  flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import DataRequired, Email, EqualTo, Length

class LoginForm(FlaskForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    senha = PasswordField('Senha', validators=[DataRequired()])
    submit = SubmitField('Entrar')

class RegistroForm(FlaskForm):
    nome_empresa = StringField('Nome da Empresa', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    senha = PasswordField('Senha', validators=[
        DataRequired(),
        Length(min=6, message='A senha deve ter pelo menos 6 caracteres')
    ])
    confirmar_senha = PasswordField('Confirmar Senha', validators=[
        DataRequired(),
        EqualTo('senha', message='As senhas devem ser iguais')
    ])
    submit = SubmitField('Registrar Empresa')
 