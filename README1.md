# RECUPERAÇÃO DE SENHA

**RF**

- O usuário deve poder recuperar sua senha através de seu e-mail.
- O usuário deve receber em seu e-mail instruções para recuprerar seua senha.
- O usuário deve poder resetar sua senha.

**RNF**

- Será usado a mailtrap para ambiente de desenvolvimento.
- Será usado Amason SES para ambiente de produção.
- O processo de envio de e-mail deverá acontecer em segundo plano (Background job).

**RN**

- O link enviado para o usuário recuperar sua senha, deve durar apenas 1 hora.
- O usuário deve repetir sua nova senha 2 vezes para poder confirmar a nova senha.

# ATUALIZAÇÃO DE PERFIL

**RF**

- O usuário deve poder atualizar nome, e-mail e foto de perfíl.

**RNF**

**RN**

- O usuário não pode alterar seu e-mail para um e-email já utilizado na base de dados.
- Para atualizar sua senha, o usuário deve informar sua senha antiga.
- Para atualizar sua senha, o usuário deve confimar sua nova senha.

# PAINEL DO PRESTADOR DE SERVIÇO

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico.
- O prestador deve receber uma notificação sempre que houver um novo agendamento
- O prestador deve visualizar as notificações não lidas.

**RNF**

- Os agendamentos do prestador em dias, deve ser armazenado em cache.
- As notificações devem ser armazenadas no MongoDB.
- As notificações do prestador devem ser enviados em tempo real, utilizando a lib socket.io.

**RN**

- A notificação deve ter um status de lida ou não-lida, para que o prestador possa controlar.

# AGENDADEMENTO DE SERVIÇOS

**RF**

- O usuário deve poder ver uma lista com todos os prestadores de serviços.
- O usuário deve poder selecionar um prestador de serviço.
- O usuário deve poder visualisar os dias disponíveis do mês de um determinado prestador de serviço
- O usuário deve poder listar os horários disponíveis do prestador.
- O usuário deve poder realizar um agendamento.

**RFN**

- A listagem de prestadores deve ser armazenada em cache.

**RN**

- Cada agendamento deve durar 1h.
- Os agendamentos devem está disponíveis entre as 8h as 18h, (o primeiro as 08:00 último as 17:00);
- O usuário não pode agendar em um horaŕio já ocupado.
- O usuário não pode agendar em um horário que já passou
- O usuário não pode agendar serviços consigo mesmo.
