# Implementação camada de Rede
Disciplina de Redes / Engenharia de Computação

Prof. Sandro Renato Dias

CEFET-MG / 2019-2

___

O objetivo desta parte do trabalho diz respeito ao roteamento realizado pela camada de rede da pilha de protocolos TCP/IP.

## Escolhas de projeto
De forma esclarecer algumas padronizações estabelecidas no projeto do grupo, os tópicos abaixo abordam sobre a comunicação entre camadas, bem como a interface disponibilizada pelo código desta camada.

### Comunicação para envio de pacotes
No envio, a camada de transporte constrói um pacote, salvo como TXT e formatado em ASCII, em uma pasta comum a todos os pacotes gerados pela pilha e passa como parâmetro um ou mais caminhos de pacotes a serem enviados na linha de comando de execução do script de rede.

Como resultado, a camada de rede escreve um pacote (também TXT/ASCII) com seu header concatenado no início. O caminho desse 
arquivo é repassado ao chamar a camada física.

### Comunicação para recebimento de pacotes
No recebimento, a camada de física constrói um pacote, salvo como TXT e formatado em ASCII, em uma pasta comum a todos os pacotes gerados pela pilha e passa como parâmetro um o caminho para aquele pacote na linha de comando de execução do script de rede.

Como resultado, a camada de rede escreve um pacote (também TXT/ASCII) sem seu header concatenado no início (logo o primeiro header passa a ser o header de transporte). O caminho desse arquivo é repassado ao chamar a camada física.

### Formato do cabeçalho
O formato do cabeçalho segue n
o seguinte formato:
||ip_origem|ip_destino|checksum||
Com os IPs e checksum separados por barras únicas e o início e fim do pacote demarcados por barras duplas.

## Algoritmo
O algoritmo, tanto para o envio quanto para o recebimento, seguem um mesmo padrão, diferenciando apenas de onde são retirados alguns campos e uma condicional extra (no caso do de recebimento).

No envio, é checado se o endereço de origem (computador atual) e o endereço de destino (pacote HTTP) sob mesma máscara de origem (JSON de configuração) resultam em um mesmo valor. Caso sejam iguais (mesma rede), o nextHop, ou próximo salto, é na realidade o próprio destino (direto). Caso contrário, checa se, dentre a lista de rotas (JSON de configuração), existe uma rota que possua conhecimento daquele IP. Caso exista, o IP da rota que conhece o IP de destino passa a ser o nextHop. Caso não exista nenhum o nextHop é o IP default configurado (JSON de config.). Por fim, o pacote de rede é salvo (TXT/ASCII) com o IP de origem sendo a máquina, o IP de destino sendo o nextHop, a máscara de origem sendo o do arquivo JSON e o checksum sendo gerado a partir do conteúdo do pacote de transporte.

No recebimento, é checado se o endereço de origem (computador atual) e o endereço de destino (pacote físico) são iguais. Caso sejam iguais, o pacote de rede é escrito (sem o cabeçalho de rede) e a camada de transporte é chamada passando o caminho para o pacote salvo. Caso contrário, as mesmas regras de roteamento são seguidas, porém, durante a reescrita do header de rede para reenvio do pacote, o IP de origem permanece o mesmo mas o IP de destino passa a ser no nextHop a partir das configurações daquele PC (arquivo JSON).

## Execução
Para a execução do código basta:

`npm run-script send path [path,...]`
`npm run-script receive path`
