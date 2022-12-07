const amqp=require("amqplib");

const message={
description:"Test Mesajı"
};

const data =require("./data.json");

// kendimiz queue yazarak istediğimiz publisherin belirlediğimiz queue'yi çalıştırmasını saglayalım.
const queueName=process.argv[2] || "jobsQueue";    // çalıştırırken; npm run publisher "isim ver"         
console.log("qu", queueName)

connect_rabbitmq();

async function connect_rabbitmq(){

    try {
        
        const connection=await amqp.connect("amqp://localhost:5672");               // amqp ile bağlan 
        const channel =await connection.createChannel();                            //Publisherin Rabbitmq ya mesaj gönderimi için channel açıyoruz.
        const asserion=await channel.assertQueue(queueName);  // channel'in hangi joba ait oldugunu soyledik.=>jobsQueue (default job) , kendimiz queueName oluşturup verdik.
        
        //
        data.forEach(i => {
            message.description = i.id;
            channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message))); //kanalda bulunan q ya bu bilgiyi göndericez.jobsQueue kanalına ,buffer tipinde gönder.
            console.log("Gönderilen Mesaj", i.id)
        });
        
       
    } catch (error) {
        console.log("error",error)
    }
}




