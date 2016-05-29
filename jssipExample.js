var sipServerHost = 'localhost:5060';
var sipUser       = 'us@officesip.local';
var sipPwd        = 'us';  

//Configuration de la connexion SIP
var configuration = {
  'ws_servers': 'ws://'+sipServerHost,
  'uri': 'sip:'+sipUser,
  'password': sipPwd
};

//Create User agent instance
var coolPhone = new JsSIP.UA(configuration);

//WebSocket connection events : Fonctions qui seront appellees par JSSIP lors d event WebSocket
coolPhone.on('connected', function(e){ 
    console.log('connected: ' + e);/* Your code here */ }
            );
coolPhone.on('disconnected', function(e){ 
    console.log('disconnected: ' + e);/* Your code here */ 
});
    
//SIP registration events : Fonctions qui seront appellees par JSSIP lors d event SIP      
coolPhone.on('registered',  function(e){ 
    console.log('registered: ' + e);/* Your code here */ 
});
coolPhone.on('unregistered',  function(e){ 
    console.log('unregistered: ' + e);/* Your code here */ 
});
coolPhone.on('registrationFailed',  function(e){ 
    console.log('registrationFailed: ' + e);/* Your code here */ 
});  

//User agent start
console.log('Starting User Agent...');  
coolPhone.start();

function send(){
    //Sending a message
    var text = 'Hello Bob!';
    var dest = 'sip:us1@officesip.local';

    // Register callbacks to desired message events : Fonctions qui seront appellees lors de l envoi de messages
    var eventHandlers = {
      'succeeded': function(e){ 
          console.log('message succeeded')/* Your code here */ },
      'failed':    function(e){ 
          console.log('message failed')/* Your code here */ }
    };

    var options = {
      'eventHandlers': eventHandlers
    };
    //Send message
    coolPhone.sendMessage(dest, text, options);  
}; 


function call(){

    var session = null;
    var dest = 'sip:us1@officesip.local';

    // HTML5 <video> elements in which local and remote video will be shown
    var selfView =   document.getElementById('local-video');
    var remoteView =  document.getElementById('remote-video');

    // Register callbacks to desired call events
    var eventHandlers = {
      'progress':   function(e){ console.log('call progress')/* Your code here */ },
      'failed':     function(e){ console.log('call failed')/* Your code here */ },
      'confirmed':  function(e){
        // Attach local stream to selfView
        selfView.src = window.URL.createObjectURL(session.connection.getLocalStreams()[0]);
        console.log('call confirmed')
      },
      'addstream':  function(e) {
        var stream = e.stream;

        // Attach remote stream to remoteView
        remoteView.src = window.URL.createObjectURL(stream);
      },
      'ended':      function(e){ console.log('call ended')/* Your code here */ }
    };

    var options = {
      'eventHandlers': eventHandlers,
      'extraHeaders': [ 'X-Foo: foo', 'X-Bar: bar' ],
      'mediaConstraints': {'audio': true, 'video': true}
    };

    session = coolPhone.call(dest, options);
}


        