 //V2.0 French only
 //@target 'indesign';
 //@targetengine 'PaletteRef';
 function xmlToJs(xml) {
     try {
         if (typeof xml == 'xml') {
             var js = {};
             js.order = [];
             // js.items={};
             var listContainer = xml.child('items');
             var items = listContainer.descendants('item');
             for (var i = 0; i < items.length(); i++) {
                 //   alert(items.child(i).attribute('name'));
                 var elem = listContainer.child(i);
                 var elemName = elem.attribute('name').toString();
                 js.order.push(elemName);
                 js[elemName] = {
                     index: i,
                     name: elem.attribute('name').toString(),
                     label: elem.attribute('label').toString(),
                     mandatory: elem.attribute('mandatory').toString(),
                     format: elem.attribute('format').toString(),
                     fieldSize: elem.attribute('fieldSize').toString(),
                 };

             }
             return js;
         } else {
             throw 'erreur dans xmlToJs() : le paramètre fourni n\'est pas un objet XML valide.';
         };
     } catch (e) {
         alert(e);
     };
 }

 main();

 function main() {
     const XML_TEMPLATE = '<?xml version="1.0" encoding="UTF-8" ?>\n<root>\n<items>\n<item name="what else ? no spaces" label="displayed text" fieldSize="30" mandatory="true/false" format="format string using {?}" />\n</items>\n</root>';
     try {
         var myDoc = app.activeDocument;
         var selec = myDoc.selection;
         var this$ = new File($.fileName);
         var srcFolderString = this$.parent.fsName + '\/' + 'src/PaletteRef.2.0/';
         var configFile = new File(srcFolderString + '\/' + 'config.xml');
         configFile.encoding = "UTF-8";
         if (configFile.exists) {
             configFile.open('r');
             var xml = new XML(configFile.read());
             var cfgData = xmlToJs(xml);
             //  alert(cfgData.intitule.label);
             // alert(xml.children());
             configFile.close();
         } else {
             configFile.open('w');
             configFile.write(XML_TEMPLATE);
             configFile.close();
             throw 'Le fichier de configuration est manquant.\nRéinitialisation du fichier de configuration dans ' + srcFolderString;
             return null;
         };

         var w = setPal();
         w.show();


         function setPal() {
             var pal = new Window('palette', 'Insérer une ligne de référence');
             //  pal.panels = [];// à remettre plus tard ?
             pal.pans = pal.add('group');
             pal.pans.orientation = 'row';
             pal.pans.activePanel = 0;


/* GESTION DES FLECHES POUR NAVIGUER D'UN CHAMP A L'AUTRE 
// Mais perte du déplacement de caret. On privilégiera SHIFT+TAB pour revenir en arrière.
             pal.pans.addEventListener('keydown', function(event) {
                 //  alert('handler triggered');
                 //    alert(event.keyIdentifier);
                 var activeIndex = this.activePanel;
                 var newIndex;
                 if (event.keyIdentifier == 'Left') {
                     event.stopPropagation();
                     event.preventDefault();
                     //  this.children[activeIndex].field.active = false;
                     if (activeIndex > 0) {
                         newIndex = activeIndex - 1;
                         //   alert('>0 = '+newIndex);
                     } else {
                         newIndex = this.children.length - 1;
                         //   alert('<0 = '+newIndex);
                     };
                     this.children[newIndex].field.active = true;
                 } else if (event.keyIdentifier == 'Right') {
                     event.stopPropagation();
                     event.preventDefault();
                     //  this.children[activeIndex].field.active = false;
                     if (activeIndex < this.children.length - 1) {
                         newIndex = activeIndex + 1;
                     } else {
                         newIndex = 0;
                     };
                     this.children[newIndex].field.active = true;
                 };
             });
GESTION DES FLECHES FIN */

             var ItemView = function(target, data) {
                 var pan = target.add('panel', undefined);
                 pan.id = data.name;
                 pan.index = data.index;
                 pan.label = pan.add('statictext', undefined, data.label);
                 pan.field = pan.add('edittext{characters:' + data.fieldSize + '}', undefined, '');
                 pan.field.onActivate = function() {
                     pal.pans.activePanel = this.parent.index;
                 };


                 pan.field.onDeactivate = function() {
                     this.text = this.text.replace(/\n/g, ''); //contourne un "bug" de ScriptUI : Empêche l'insertion automatique d'un retour forcé sur le premier champ focus quand on passe d'une fenêtre à l'autre (fin de modale, ou nouvelle instance de la WindowSUI courante).
                 }


                 if (cfgData.order[0] == data.name) {
                     pan.field.active = true;
                 } else {
                     pan.field.active = false;
                 };
                 pan.mandatory = pan.add('checkbox{value:' + data.mandatory + ',enabled:false}', undefined, 'mandatory');
                 var placeholderRx = /\{\?\}/;
                 if (!placeholderRx.test(data.format)) {
                     throw 'XML : Erreur de syntaxe dans le format de l\'item "' + data.name + '".';
                 } else {
                     pan.format = pan.add('statictext', undefined, '<' + data.format + '>');
                 };

                 return pan;
             }


             for (var i = 0; i < cfgData.order.length; i++) {
                 new ItemView(pal.pans, cfgData[cfgData.order[i]]);
             };




             pal.winHandlingGrp = pal.add('group');
             pal.winHandlingGrp.orientation = 'row';
             pal.notification = pal.winHandlingGrp.add('edittext{enabled:false,characters:72}');
             var okButt = pal.winHandlingGrp.add('button', undefined, 'OK');
             pal.nextLine = pal.winHandlingGrp.add('button', undefined, 'Ajouter une ligne');
             var palCan = pal.winHandlingGrp.add('button', undefined, 'Annuler');


             Button.prototype.activateKeyboardValidation = function() {
                 this.addEventListener('keydown', function(event) {
                     /*                   DONNE LA LISTE DES PROPRIETES DE EVENT
                                          // var e=[];
                                          // for (property in event) {
                                          //   e.push(property+'\n');
                                          // };
                                          // e.join(''); alert(e);
                                           */
                     if (event.keyIdentifier == 'Enter') {
                         this.onClick();
                     }
                 });
             }
             palCan.onClick = palCancel;
             palCan.activateKeyboardValidation();
             okButt.onClick = okButtAction;
             okButt.activateKeyboardValidation();
             okButt.onDeactivate = function() {
                 pal.notification.text = '';
             };
             pal.nextLine.onClick = nextLineAction;
             pal.nextLine.onDeactivate = function() {
                 pal.notification.text = '';
             };
             pal.nextLine.activateKeyboardValidation();


             function insert(endString) {
                 try {
                     if (endString == undefined) {
                         var end = '';
                     } else {
                         var end = endString;
                     }
                     var res = [];
                     for (var i = 0; i < pal.pans.children.length; i++) {
                         var str = formatStringFragment(pal.pans.children[i], cfgData[cfgData.order[i]]);
                         if (str == null || str == undefined) {
                             return null;
                         };
                         res.push(str);

                     };

                     return textInject(res.join('') + end);
                 } catch (e) {
                     alert(e);
                 };

             }

             function formatStringFragment(panel, cfgElement) {
                 try {
                     var fieldContent = panel.field.text;
                     var mand = panel.mandatory.value;
                     var format = cfgElement.format;
                     if (mand && fieldContent == '') {
                         throw 'Le champ ' + panel.label.text + ' ne peut pas être vide.';
                     } else if (!mand && fieldContent == '') {
                         return '';
                     };
                     return format.replace(/\{\?\}/g, fieldContent);

                 } catch (e) {
                     pal.notification.text = e;
                     return null;
                 }
             }

             function textInject(arg1) {
                 var dicoConstructors = {
                     "TextFrame": 0,
                     "InsertionPoint": 1,
                     "Text": 1,
                     "TextColumn": 1
                 };
                 var selecName = app.selection[0].constructor.name;
                 try {
                     if (selecName in dicoConstructors) {
                         var sw = dicoConstructors[selecName];
                         switch (sw) {
                             case 0:
                                 selec[0].parentStory.insertionPoints.item(-1).contents = arg1;
                                 break;
                             case 1:
                                 app.selection[0].contents = arg1;
                                 break;
                         };

                     };
                 } catch (e) {
                     alert("Sélection non valide.");
                     return null;
                 };
                 return true;
             }

             function okButtAction() {
                 var res = insert();
                 //   alert(res);
                 if (res !== null && res !== undefined) {
                     pal.close();
                 };

                 return;
             }

             function nextLineAction() {
                 var res = insert('\r');
                 if (res !== null && res !== undefined) {
                     pal.close();
                     w = null;
                     w = setPal();
                     w.show();
                 };
                 return;
             }

             function palCancel() {
                 pal.close();
                 return;
             }

             return pal;

         }
     } catch (e) {
         alert(e);
     };
 }