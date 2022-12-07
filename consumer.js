const amqp=require("amqplib");

const queueName=process.argv[2] || "jobsQueue";    // çalıştırırken; npm run publisher "isim ver"          


connect_rabbitmq();

async function connect_rabbitmq(){

    try {
        
        const connection=await amqp.connect("amqp://localhost:5672");               // amqp ile bağlan 
        const channel =await connection.createChannel();                            //Publisherin Rabbitmq ya mesaj gönderimi için channel açıyoruz.
    
    
        const asserion=await channel.assertQueue(queueName);  // channel'in hangi joba ait oldugunu soyledik.=>jobsQueue(default hali. queue tanımlayıp özelleştirmezsek.)
        

        console.log("mesaj bekleniyor...")
        //mesajın alınması
        channel.consume(queueName,message=>{
            console.log("Message",message.content.toString())
            channel.ack(message);                                      //gelen mesajla işi bittikten sonra kuyruktan çıkartır. 
        })


    } catch (error) {
        console.log("error",error)
    }
}

