const options = 
{
    'prefix': '/',
    'timeout': 10000
}


const Discord = require('discord.js');

const app = new Discord.Client();

const token = require('./secret.js');

let guild, member, memberID, game, channel;

let secondsOfPlaying = 0;

let isOnline = false;

let isPlaying = false;

let isDifferentGame = false;

app.on('ready', () =>
{
 app.user.setActivity("Monitoruje Grzegorza");
})

app.on('message', data =>
{

  let args = data.content.split(' ');

  if(data.content.includes(options.prefix))
  {
    switch(args[0])
    {
        case '/pilnuj':
            lookForUserNickname(data, args);
            break;
    }
  }

});



function lookForUserNickname(message, args)
{

 member = message.mentions.users.first();

 if(!member)
 {
     message.reply('Nie oznaczyłeś nikogo!');
 }
 else
 {
    memberID = member.id;
    guild = message.guild;
    channel = message.channel;

    startLooking();
 }

}

function startLooking()
{
    setInterval(fetch, options.timeout);
    console.log(`Started at ${guild.name} at channel ${channel.name}`);
}

function fetch()
{
    app.fetchUser(memberID)
    .then(data =>
    {

        if(!isOnline && data.presence.status === "online")
        {
        channel.send("O! Grzegorz aktywny, zobaczymy za ile zagra w Terrarie :thinking:");
        isOnline = true;
        } else if(isOnline && data.presence.status !== "online")
        {
            channel.send("Cooo, Grzegorz nieaktywny? Co się stało? :thinking:");
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

            if(game.toLowerCase() !== 'terraria' && isPlaying)
            {
                playingStatusChange(false);
            } else if (game.toLowerCase() === 'terraria' && !isPlaying)
            {
                playingStatusChange(true);
                isDifferentGame = false;
            }
            else if(game.toLowerCase() !== 'terraria' && game.toLowerCase() !== "brak" && !isDifferentGame)
            {
                channel.send("Grześ nie gra w Terrarie :hushed:! jak to się stało? Ale i tak w nią później zagra :wink:");
                isDifferentGame = true;
            }
            else if (game.toLowerCase() === 'terraria' && isPlaying)
            {
                secondsOfPlaying += 10;
                switch(secondsOfPlaying)
                {
                    case 60:
                        channel.send(`Ojojoj, zaczyna się, już minuta Grześ!   :rofl:`);
                        break;
                    case 900:
                        channel.send(`Grześ, już 25% godziny przegrałeś!`);
                        break;
                    case 1800:
                        channel.send(`Grzegorz! Już połowa godziny za tobą!`);
                        break;
                    case 3600:
                        channel.send(`Dobra, Grześ, co prawda już godzina ale to nie jest tak dużo jak zawasze!  :laughing: `);
                        break;
                    case 5400:
                        channel.send("Już 1,5 godziny zmarnowałeś, no cóż XD");
                        break;
                    case 7200:
                        channel.send(`Już 2 godziny! Grześ, kończ powoli!  :rage: `);
                        break;
                    case 10800:
                        channel.send(`GRZEŚ! 3 GODZINY! ZRÓB SE PRZERWE!   :tired_face: `);
                        break;
                    case 14400:
                        channel.send("4 godziny, Grześ, to już przesada!");
                        break;
                    case 18000:
                        channel.send("5 godzin, chyba zwariowałeś, wyłązczaj ten komputer!");
                        break;
                    case 21600:
                        channel.send("6 godzin, czy on tam jeszcze żyje?   :thinking: :scream: ");
                        break;
                    case 28800:
                        channel.send("8 godzin, chyba już Grzegorza nie zobaczymy nigdy na oczy   :cry: ");

                }


            }

        });

}

function playingStatusChange(playing)
{
    if(playing)
    {
        channel.send(`Grzegorz zaczął grać w Terrarie!  :heart_eyes:`);
        isPlaying = true;
    }
    else
    {
    channel.send(`Grzegorz już nie gra w Terrarie! Grał od ${parseTime()}  :hushed: `);
    secondsOfPlaying = 0;
    isPlaying = false;
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


app.login(token);
