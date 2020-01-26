const options = 
{
    'prefix': '/',
    'timeout': 10000
}


const Discord = require('discord.js');

const app = new Discord.Client();

const token = require('./secret.js');

let guild, member, memberID, game, channel, nickname;

let currentGame = 'brak';

let interval;

let secondsOfPlaying = 0;

let isOnline = false;

let isPlaying = false;

app.on('ready', () =>
{
 app.user.setActivity("Pilnuje Grzegorza");
})

app.on('message', data =>
{

  let args = data.content.split(' ');

  if(data.content.includes(options.prefix))
  {
    switch(args[0])
    {
        case '/pilnuj':
            lookForUserNickname(data);
            break;
        case '/resetuj':
            reset();
            data.reply('Zresetowano!');
            break;
    }
  }
});



function lookForUserNickname(message)
{

 member = message.mentions.users.first();

 if(!member)
 {
     message.reply('Nie oznaczyłeś nikogo!');
     message.reply("Pamiętaj o składni - /pilnuj <użytkownik>");
 }
 else
 {
    nickname = member.username;
    memberID = member.id;
    guild = message.guild;
    channel = message.channel;
    startLooking();
    message.reply(`Zaczynam pilnować ${nickname}!`);
 }

}

function startLooking()
{
    interval = setInterval(fetch, options.timeout);
    console.log(`Started at ${guild.name} at channel ${channel.name} at user ${nickname}`);
}

function fetch()
{
    app.fetchUser(memberID)
    .then(data =>
    {

        if(!isOnline && data.presence.status === "online")
        {
        channel.send(`O! ${nickname} aktywny, zobaczymy za ile zagra :thinking:`);
        isOnline = true;
        } else if(isOnline && data.presence.status !== "online")
        {
            channel.send(`Cooo, ${nickname} nieaktywny? Co się stało? :thinking:`);
            isOnline = false;
        }

            if(data.presence.game == null)
            {
                game = 'brak';
            }
            else
            {
             game = data.presence.game.name;
            }

            if(game.toLowerCase() == 'brak' && isPlaying)
            {
                playingStatusChange(false);
                channel.send(`${nickname} nie gra w gre! Ale i tak w nią później zagra :wink:`);
            } else if (game.toLowerCase() !== 'brak' && !isPlaying)
            {
                currentGame = game.toLowerCase();
                let array = currentGame.split(" ");
                let gameArray = array.map(elem => elem.charAt(0).toUpperCase() + elem.slice(1).toLowerCase());
                currentGame = gameArray.join(" ");
                playingStatusChange(true);

            }
            else if (game.toLowerCase() == currentGame.toLowerCase() && isPlaying)
            {
                secondsOfPlaying += 10;
                switch(secondsOfPlaying)
                {
                    case 60:
                        channel.send(`Ojojoj, zaczyna się, już minuta ${nickname}!   :rofl:`);
                        break;
                    case 900:
                        channel.send(`${nickname}, już 25% godziny przegrałeś!`);
                        break;
                    case 1800:
                        channel.send(`${nickname}! Już połowa godziny za tobą!`);
                        break;
                    case 3600:
                        channel.send(`Dobra, ${nickname}, co prawda już godzina ale to nie jest tak dużo jak zawasze!  :laughing: `);
                        break;
                    case 5400:
                        channel.send("Już 1,5 godziny zmarnowałeś, no cóż XD");
                        break;
                    case 7200:
                        channel.send(`Już 2 godziny! ${nickname}, kończ powoli!  :rage: `);
                        break;
                    case 10800:
                        channel.send(`${nickname.toUpperCase()}! 3 GODZINY! ZRÓB SE PRZERWE!   :tired_face: `);
                        break;
                    case 14400:
                        channel.send("4 godziny, ${nickname}, to już przesada!");
                        break;
                    case 18000:
                        channel.send("5 godzin, chyba zwariowałeś, wyłączaj ten komputer!");
                        break;
                    case 21600:
                        channel.send("6 godzin, czy on tam jeszcze żyje?   :thinking: :scream: ");
                        break;
                    case 28800:
                        channel.send("8 godzin, chyba już pana pod nickiem ${nickname} nie zobaczymy nigdy na oczy   :cry: ");

                }


            }
            else if (game.toLowerCase() != currentGame && isPlaying)
            {
                playingStatusChange(false);
                channel.send(`${nickname} nie gra w gre! Ale i tak w nią później zagra :wink:`);
                currentGame = false;
                isPlaying = false;
            }

        });

}

function playingStatusChange(playing)
{
    if(playing)
    {
        secondsOfPlaying = 0;
        channel.send(`${nickname} zaczął grać w ${currentGame}!  :heart_eyes:`);
        isPlaying = true;
    }
    else
    {
    channel.send(`${nickname} już nie gra w ${currentGame}! Grał od ${parseTime()}  :hushed: `);
    secondsOfPlaying = 0;
    isPlaying = false;
    currentGame = '';
    }
}


function parseTime()
{
    let seconds = secondsOfPlaying;

    //hours

    let hours = Math.floor(seconds/3600);
    seconds -= hours * 3600;

    //minutes
    let minutes = Math.floor(seconds/60);
    seconds -= minutes * 60;

    //seconds is variable "seconds"

    

    let string = `${hours} ${hours === 1 ? 'godziny' : 'godzin'} ${minutes} ${minutes === 1 ? 'minuty' : 'minut'} ${seconds} ${seconds === 1 ? 'sekundy' : 'sekund'}`;

    return string;

}


function reset()
{
    guild = member = memberID = game = channel = nickname = undefined;
    currentGame = '';
    secondsOfPlaying = 0;
    isOnline = false;
    isPlaying = false;
    clearInterval(interval);
    console.log("Reseted!");
}

app.login(token);
