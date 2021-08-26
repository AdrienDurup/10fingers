 //@target 'indesign';
 //@targetengine 'PaletteRef';
var myDoc=app.activeDocument;
var selec=myDoc.selection;
var w=setPal();
//AJOUTER LA POSSIBILITE DE FAIRE ENTREE POUR VALIDER LE BOUTON QUAND IL EST SELECTIONNE
//Ajouter la gestion de l'extraction inCopy
w.show();
function setPal(){
var refPal=new Window('palette','Insérer une ligne de référence');
//var grp0=refPal.add('statictext',undefined,'Réf------Prix------PU-------Objet--------------------------');
var grp1=refPal.add('group');
grp1.orientation='row';
//var grps=refPal.groups;
var ch5=grp1.add('edittext{characters:30,active:true}',undefined,'intitulé');
var ch1=grp1.add('edittext{characters:5,text:"Réf\."}',undefined,'Réf');//on deactivate check validity
var ch2=grp1.add('edittext{characters:6,text:"Prix"}',undefined,'Prix');//on deactivate check validity
var ch3=grp1.add('edittext{characters:6,text:"PU"}',undefined,'PU');
var ch4=grp1.add('edittext{characters:30,text:"Objet"}',undefined,'objet');
var winHandlingGrp=refPal.add('group');
winHandlingGrp.orientation='row';
var okButt=winHandlingGrp.add('button',undefined,'OK');
var nextLine=winHandlingGrp.add('button',undefined,'Ajouter une ligne');
//~ okButt.onActivate=isActive;
//~ nextLine.onActivate=isActive;
//~ okButt.onDeactivate=isActive;
//~ nextLine.onDeactivate=isActive;
//~ var activeButt;
//~ function isActive(){
//~     if (activeButt==this.text){
//~     activeButt='';
//~     }else{activeButt=this.text;};
//~     $.writeln(activeButt);
//~     }

var palCan=winHandlingGrp.add('button',undefined,'Cancel');
palCan.onClick=palCancel;
okButt.onClick=okButtAction;
nextLine.onClick=nextLineAction;
function insert(txt5,txt1,txt2,txt3,txt4,newPara){
    //Pouvoir insérer les "soit" seuls
var arrInsert= new Array('','','','');

if(newPara==true){
    arrInsert[3]='\r';
    }
else{
    arrInsert[3]='';
};    

if(txt5!=''){
    arrInsert[0]=txt5+'\t';
};

//try{
if(txt1!=''&&txt2!=''&&txt1!='Réf\.'&&txt2!='Prix'){
        arrInsert[1]=txt1+' > '+txt2+'€ttc';
}else{
    arrInsert[1]='';
};
//~ }
//~catch(e){
//~     alert('Champs obligatoires non renseignés');
//~ };

if (txt3==''||txt4==''||txt3=='PU'||txt4=='Objet'){
    arrInsert[2]='';
}else{
    arrInsert[2]='\ (soit '+txt3+'€ttc '+txt4+')';
};

//~ if(txt1==''||txt2==''||txt1=='Réf\.'||txt2=='Prix'){
//~ alert('Champs obligatoires non renseignés');
//~     }
//~ else{
var inj=arrInsert.join('');
textInject(inj);
}

function okButtAction(){
    insert(ch5.text,ch1.text,ch2.text,ch3.text,ch4.text,false);
    w.hide();
    return;
}
function textInject(arg1){
var dicoConstructors={
        "TextFrame":0,
        "InsertionPoint":1,
        "Text":1,
        "TextColumn":1
    };
var selecName=app.selection[0].constructor.name;
 try{
     if(selecName in dicoConstructors){
         var sw=dicoConstructors[selecName];
        switch(sw){
             case 0 :
             selec[0].parentStory.insertionPoints.item(-1).contents=arg1;
             break;
            case 1 :
            app.selection[0].contents=arg1; 
            break;
        };
    };
    }catch(e){
        alert("Sélection non valide.");
    };
}
function nextLineAction(){
    //selec[0].parentStory.insertionPoints.item(-1).contents='\r';//INTÉGRER  DANS INSERT AVEC CONDITION AVEC TRIGGER DANS NExtlineaction
    insert(ch5.text,ch1.text,ch2.text,ch3.text,ch4.text,true);
    w.hide();
   // return refPal;
//w=setPal();
    w.show();   
    return;
}
function palCancel(){
 w.hide();
 return;  
}
//~ function addLine(){
//~     var i =grps.length;
//~     refPal.
//~     };
return refPal;

} 