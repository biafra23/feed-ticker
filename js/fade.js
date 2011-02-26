function utf8unescape(utftext) {
    return decodeURIComponent(utftext);
}

// -------------------------------------------------------------------
// Ticker 
// Derived from Dynamic Drive's AJAX XML Ticker (http://www.dynamicdrive.com)
// -------------------------------------------------------------------


// -------------------------------------------------------------------
// Main Ticker Object function
// ticker(xmldata, divId, divClass, delay, optionalfadeornot)
// -------------------------------------------------------------------

function ticker(xmldata, divId, delay, fadeornot){
    this.xmldata=xmldata //Variable pointing to the local ticker xml file (txt)
    this.tickerid=divId //ID of ticker div to display information
    this.delay=delay //Delay between msg change, in miliseconds.
    this.pointer=0
    this.messages=[] //Arrays to hold each message of ticker  
    document.getElementById(this.tickerid).innerHTML = '<div>Initializing ticker...</div>';
    this.initialize()
}


// -------------------------------------------------------------------
// initialize()- Initialize ticker method.
// -Gets contents of xml file and parse it using JavaScript DOM methods 
// -------------------------------------------------------------------

ticker.prototype.initialize=function(){ 
    this.contentdiv=document.getElementById(this.tickerid).firstChild //div of inner content that holds the messages
    this.contentdiv.style.display="none"    
    this.contentdiv.innerHTML=this.xmldata
    if (this.contentdiv.getElementsByTagName("div").length==0){ //if no messages were found
        this.contentdiv.innerHTML="<b>Error</b> fetching remote ticker file!"
        return
    }
    var instanceOfTicker=this
    //Cycle through XML object and store each message inside array
    for (var i=0; i<this.contentdiv.getElementsByTagName("div").length; i++){
        if (this.contentdiv.getElementsByTagName("div")[i].className=="message")
            this.messages[this.messages.length]=this.contentdiv.getElementsByTagName("div")[i].innerHTML
    }
    this.contentdiv.innerHTML=""
    this.contentdiv.style.display="block"
    this.rotatemsg()            
}

// -------------------------------------------------------------------
// rotatemsg()- Rotate through ticker messages and displays them
// -------------------------------------------------------------------

ticker.prototype.rotatemsg=function(){
    var instanceOfTicker=this        
    new Effect.Fade(this.tickerid,{duration: 1.5, queue:'end', afterFinish: function(){instanceOfTicker.display()}});
    
}

ticker.prototype.display = function(){
    var instanceOfTicker=this    
    var content = this.messages[this.pointer];
    new Effect.Updater(this.tickerid,{newContent:content,queue:'end',beforeStart:function(){Element.hide(instanceOfTicker.tickerid)}});
    new Effect.Appear(this.tickerid,{duration: 1.5, queue:'end',afterFinish: function(){
        instanceOfTicker.pointer=(instanceOfTicker.pointer<instanceOfTicker.messages.length-1)? instanceOfTicker.pointer+1 : 0
        setTimeout(function(){instanceOfTicker.rotatemsg()}, instanceOfTicker.delay) //update container periodically
    }});        
}

Effect.Updater = Class.create();
Object.extend(Object.extend(Effect.Updater.prototype,
Effect.Base.prototype), {
    initialize: function(element) {
        this.element = $(element);
        var options = Object.extend({
            duration: 0.001,
            newContent: ''
        }, arguments[1] || {});
        this.start(options);
    },
    loop: function(timePos) {
        if(timePos >= this.startOn) {
            Element.update(this.element,this.options.newContent);
            this.cancel();
            return;
        }
    }
});

