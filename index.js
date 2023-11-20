const Discord  = require("discord.js");
const DiscordModal = require('discord-modal');
const client = new Discord.Client({ 
  intents: ['GUILDS', 'GUILD_MESSAGES']
});
const fs = require('fs');
client.on('ready', () =>  console.log(`Logado em: ${client.user.tag} (${client.user.id})`));
const config = require('./config.json')

process.on('unhandledRejection', () => {});
process.on('uncaughtException', () => {});
process.on('uncaughtRejection', () => {});
process.on('uncaughtExceptionMonitor', () => {});
process.on('multipleResolves', () => {});


client.once('ready', () => {
  console.log(` key b2 Bot está online como ${client.user.tag}`);
  loadInteractions();

  const tabela = [
    { name: 'LEANDROTN NO TOPO :)', type: 'PLAYING' },
    { name: 'Desenvolvido By:TNCORPORATION', type: 'WATCHING' },
    { name: 'APROVANDO FORMULARIOS STAFF', type: 'LISTENING' },
    { name: 'Estou na versão 0.1 Beta', type: 'STREAMING', url: 'https://www.twitch.tv/leandrotn3' },
    { name: 'Em campeonato de Conhecimento', type: 'COMPETING' },
  ];

  function setStatus() {
    const altstatus = tabela[Math.floor(Math.random() * tabela.length)];
    client.user.setActivity(altstatus);
  }

  setStatus('online');
  setInterval(setStatus, 5000);
});


const Data = require("st.db")
const db = new Data({
  path:"applys.json"
})
const ms = require("ms")
const apply_time_db = new Data({
  path:"applys_time.json"
})
DiscordModal(client)

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.content === 'm!help') {
    if (!config.idadm.includes(message.author.id)) {
      message.channel.send({content:'ℹ️ **|** Somente o administrador pode usar esse comando.', ephemeral: true});
      return;
    }
    const helpEmbed = new Discord.MessageEmbed()
      .setTitle('Comandos Disponíveis')
      .setDescription('Aqui estão os comandos disponíveis:')
      .addField('`m!rmvuser <ID>`', 'Remove a entrada de um usuário com o ID especificado.')
      .addField('`m!formstaff`', 'Abre um formulário para inscrição na equipe de staff.')
      .addField('`m!deletdb`', 'Limpa o banco de dados.')
      .setColor('#0099ff')
      .setFooter('TN CORPORATION');

    message.channel.send({ embeds: [helpEmbed] });
    message.delete();
  }
  if (message.content === 'm!deletdb') {
    if (!config.idadm.includes(message.author.id)) {
      message.channel.send({content:'ℹ️ **|** Somente o administrador pode usar esse comando.', ephemeral: true });
      return;
    }
    db.clear(); 
    apply_time_db.clear(); 
    await message.channel.send('🗑️ **|** Banco de dados já era deleto tudo!!');
     message.delete();
  }
    if (message.content.startsWith('m!rmvuser')) {
      message.delete();
      if (!config.idadm.includes(message.author.id)) {
        message.channel.send({content:`ℹ️ **|** Somente o administrador pode usar esse comando.`, ephemeral: true});
        return;
      }
      const args = message.content.split(' ');

      if (args.length < 2) {
        message.channel.send({content:`ℹ️ **|** Por favor, forneça o ID do usuário para deleta informações do seu formulário.`, ephemeral: true});
        return;
      }
      const userId = args[1]; 
      fs.readFile('applys.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
          return message.channel.send('❌ **|** Ocorreu um erro ao Buscar o formulário do usuário.');
        }

        try {
          const jsonData = JSON.parse(data);
          const index = jsonData.findIndex(entry => entry[0] === `submit_${userId}`);

          if (index !== -1) {
            jsonData.splice(index, 1);
            fs.writeFile('applys.json', JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
              if (writeErr) {
                console.error(writeErr);
                return message.channel.send('❌ **|** Ocorreu um erro ao Buscar o formulário do usuário.');
              }
              message.channel.send(' ✅  **|** dados do formulário do usuário removido com sucesso.');
            });
          } else {
            message.channel.send('ℹ️ **|** Nenhum formulário encontrado para esse usuário.');
          }
        } catch (parseError) {
          console.error(parseError);
          message.channel.send('❌ **|** Ocorreu um erro ao Buscar o formulário do usuário')
        }
      });
    }

  if (message.content === 'm!formstaff') {
    if (!config.idadm.includes(message.author.id)) {
      message.channel.send({content: `ℹ️ **|** Somente o administrador pode usar esse comando.`, ephemeral: true});
      return;
    }
     const embedtest= new Discord.MessageEmbed()
     .setColor("#444de9")
     .setTitle(`Formulario Staff`)
     .setThumbnail(client.user.displayAvatarURL())
     .setDescription(`Clike no botão abaixo para fazer o formulário`)

    return message.channel.send({
      embeds: [embedtest],
      components: [
        {
          type: 1, components: [
            { type: 2, style: 3, custom_id:'submit_a_support_rank_button', label: 'Form', emoji: '📋' }
          ]
        }
      ]
    })
     message.delete();
  }
})

client.on(`interactionCreate`,async(interaction)=>{
  if(interaction.isButton()){
    if(interaction.customId == 'submit_a_support_rank_button'){
      if(await db.has({key:`submit_${interaction.user.id}`}) == true) return await interaction.reply({content:":x: Você já enviou uma solicitação para staff aguarda, não pode se inscrever mais de uma vez!", ephemeral:true})
      await apply_time_db.set({
        key:`time_${interaction.user.id}`,
        value:new Date()
      })
     const textinput = new DiscordModal.TextInput()
     .setCustomId("submit_a_support_rank")
     .setTitle("Envia uma solicitação pra staff")
     .addComponents(
       new DiscordModal.TextInputField()
       .setLabel("Qual seu nome e idade verdadeiros?:")
       .setStyle("short")
       .setPlaceholder("Leandrotn:23")
       .setCustomId("ask_1")
       .setMin(2)
       .setMax(100)
       .setRequired(true),
       new DiscordModal.TextInputField()
       .setLabel("Quanto tempo você passa no discord?:")
       .setStyle("short")
       .setMin(2)
       .setMax(3)
       .setPlaceholder("24h sou robo")
       .setCustomId("ask_2"),
       new DiscordModal.TextInputField()
       .setLabel("Como você poderá ajudar o servidor?:")
       .setStyle("paragraph")
       .setCustomId("as45k_3")
       .setPlaceholder("Ajudando muito '-'"),
      new DiscordModal.TextInputField()
       .setLabel("A quanto tempo você está no servidor?:")
       .setStyle("short")
       .setCustomId("ask2_3")
       .setPlaceholder("há um 1dia ou semana seila.."),
      new DiscordModal.TextInputField()
       .setLabel("Por que você deseja ser da equipe?:")
       .setStyle("paragraph")
       .setCustomId("ask_13")
       .setPlaceholder("Quero ser rico de conhecimento!!")
       )
      client.TextInputs.open(interaction, textinput) 
    }
  }
})

client.on("interactionTextInput", async (interaction) => {
  if (interaction.customId == 'submit_a_support_rank') {
    let time = ms(Date.now() - new Date(await apply_time_db.get({ key: `time_${interaction.user.id}` })))

    const userResponsible = interaction.user;

    await interaction.reply({ content: `✅ Enviado Em \n ${time} segundo's Agora só esperar!!`, ephemeral: true });

    let embed = new Discord.MessageEmbed()
      .setColor('GREEN')
      .setTitle(`Formulario de: ${userResponsible.username} (\`${userResponsible.id}\`)`)
      .setThumbnail(userResponsible.displayAvatarURL())
      .setDescription(`
\`\*\` **Qual seu nome e idade verdadeiros?:**
${interaction.fields[0].value}
 \`\*\` **Quanto tempo você passa no discord?:**
${interaction.fields[1].value}  
 \`\*\` **Como você poderá ajudar o servidor?:**
${interaction.fields[2].value}  
 \`\*\` **Como você poderá ajudar o servidor?:**
${interaction.fields[3].value}  
 \`\*\` **Por que você deseja ser da equipe?:**
${interaction.fields[4].value}
  `)
      .setTimestamp();
     
    await client.channels.cache.get(config.logsform).send({  
      embeds: [embed],
      components: [
        new Discord.MessageActionRow().addComponents(
          new Discord.MessageButton()
            .setCustomId('aceito')
            .setLabel('✅')
            .setStyle('SUCCESS'),
          new Discord.MessageButton()
            .setCustomId('recuso')
            .setLabel('❌')
            .setStyle('DANGER')
        )
      ]
    });

    await db.set({
      key: `submit_${interaction.user.id}`,
      value: true
    });
  }
});

async function darCargoAoUsuario(userId, roleId) {
   try {
    const guild = await client.guilds.fetch(config.idservidor);  
    const member = await guild.members.fetch(userId);
    const role = guild.roles.cache.get(roleId); 

    if (member && role) {
      await member.roles.add(role);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erro ao dar cargo ao usuário:', error);
    return false;
  }
}
async function desativarBotoes(interaction) {
  interaction.message.components[0].components[0].setDisabled(true);
  interaction.message.components[0].components[1].setDisabled(true);
  await interaction.message.edit({ components: [interaction.message.components[0]] });
}

client.on('interaction', async (interaction) => {
  if (interaction.isButton()) {
    if (interaction.customId === 'aceito') {
      if (config.idadm.includes(interaction.user.id)) {
        desativarBotoes(interaction);
        await interaction.reply({content: `✅ **|** Oia Boa escolha Adm`, ephemeral: true });

        const adminUser = interaction.user;

        const userId = interaction.message.embeds[0].title.match(/\(\`(.+?)\`/)[1];
        const userResponsible = await client.users.fetch(userId);

        const roleId = config.cargo; 
        const sucesso = await darCargoAoUsuario(userId, roleId);

        if (sucesso) {
          const acceptedMessage = `✅ **|** Parabéns, ${userResponsible}! Seu formulário foi revisado por ${adminUser} e você agora é um membro da equipe. Você recebeu o cargo.`;
          await client.channels.cache.get(config.log).send(acceptedMessage); 
        } else {
          const errorMessage = `⚠️ **|** Houve um erro ao dar o cargo a ${userResponsible}. Por favor, atribua o cargo manualmente.`;
          await client.channels.cache.get(config.log).send(errorMessage); 
        }
      } else {
        await interaction.reply({ content:`❌ **|** Você não tem permissão para executar esta ação.`, ephemeral: true });
      }
    } else if (interaction.customId === 'recuso') {
      if (config.idadm.includes(interaction.user.id)) {
        desativarBotoes(interaction);
        await interaction.reply({ content:`❌ **|** Vix Adm esse é problema em`, ephemeral: true });

        const adminUser = interaction.user;
        const userId = interaction.message.embeds[0].title.match(/\(\`(.+?)\`/)[1];
        const userResponsible = await client.users.fetch(userId);

        async function sendRejectedMessage() {
          const rejectedMessage = `❌ **|** Desculpe, ${userResponsible}. Seu formulário foi revisado por ${adminUser}, e infelizmente não podemos aceitá-lo no momento. Continue se esforçando e tente novamente no futuro.`;
          await client.channels.cache.get(config.log).send(rejectedMessage);
        }
        await sendRejectedMessage();
      } else {
        await interaction.reply({ content:` ❌ **|** Você não tem permissão para executar esta ação.`, ephemeral: true });
      }
    }
  }
});


client.login(config.token)