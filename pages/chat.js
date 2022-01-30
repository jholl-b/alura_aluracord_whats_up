import { Backdrop, CircularProgress } from '@mui/material';
import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import appConfig from '../config.json';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzU2MzEwNywiZXhwIjoxOTU5MTM5MTA3fQ.ULbMAIqBf4jKJbp6uPqH0KxMQNJLBFQF-BxIJXY11yA';
const SUPABASE_URL = 'https://iwxgwhhlvkmrfqwttxlx.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {

  const [mensagem, setMensagem] = useState('');
  const [listaMensagens, setListaMensagens] = useState([]);
  const [backdrop, setBackdrop] = useState(true);

  useEffect(() => {
    supabaseClient
      .from('mensagens')
      .select('*')
      .order('id', { ascending: false })
      .then(({ data }) => {
        setListaMensagens(data);

        setBackdrop(false);
      });
  }, []);

  function handleNovaMensagem(novaMensagem) {

    if (novaMensagem.length == 0)
      return;

    const mensagem = {
      de: 'jholl-b',
      texto: novaMensagem
    }

    supabaseClient
      .from('mensagens')
      .insert(mensagem)
      .then(({ data }) => {
        setListaMensagens([data[0], ...listaMensagens]);
      });

    setMensagem('');
  }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >

          <MessageList mensagens={listaMensagens} setMensagens={setListaMensagens} setBackdrop={setBackdrop} />

          <Box
            as="form"
            styleSheet={{
              display: 'flex',
            }}
          >
            <TextField
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                color: appConfig.theme.colors.neutrals[200],
              }}
              value={mensagem}
              onChange={(event) => setMensagem(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
            />

            <Button
              label='&#x27a4;'
              styleSheet={{
                width: '50px',
                height: '45px',
                padding: '6px 8px',
              }}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              disabled={mensagem.length <= 0}
              onClick={(event) => {
                handleNovaMensagem(mensagem);
              }}
            />

              <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={backdrop}
              >
                <CircularProgress color='inherit' />
              </Backdrop>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  var {mensagens, setMensagens, setBackdrop} = props;

  function handleApagaMensagem(id) {

    setBackdrop(true);

    supabaseClient
      .from('mensagens')
      .delete()
      .match({ id: id })
      .then(() => {
        var newMsgs = mensagens.filter((msg) => msg.id != id);
        setMensagens(newMsgs);

        setBackdrop(false);
      });
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Box key={mensagem.id} styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
            <Box>
              <Text
                tag="li"
                styleSheet={{
                  borderRadius: '5px',
                  padding: '6px',
                  marginBottom: '12px',
                  hover: {
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                  }
                }}
              >
                <Box
                  styleSheet={{
                    marginBottom: '8px',
                  }}
                >
                  <Image
                    styleSheet={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      marginRight: '8px',
                    }}
                    src={`https://github.com/${mensagem.de}.png`}
                  />
                  <Text
                    tag="strong"
                    styleSheet={{
                      display: 'inline-block'
                    }}
                  >
                    {mensagem.de}
                  </Text>
                  <Text
                    styleSheet={{
                      fontSize: '10px',
                      marginLeft: '8px',
                      display: 'inline-block',
                      color: appConfig.theme.colors.neutrals[300],
                    }}
                    tag="span"
                  >
                    {(new Date().toLocaleDateString())}
                  </Text>
                </Box>
                {mensagem.texto}
              </Text>
            </Box>
            <Button
              label='&#x2718;'
              onClick={() => handleApagaMensagem(mensagem.id)}
              styleSheet={{
                marginRight: '10px',
                width: '10px',
                height: '10px'
              }} />
          </Box>
        );
      })}
    </Box>
  )
}