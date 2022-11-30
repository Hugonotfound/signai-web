const PDFDocument = require('pdfkit');

function buildPDF(dataCallback, endCallback, project) {
    const doc = new PDFDocument({ bufferPages: true, font: 'Helvetica', size: 'A4' });

    doc.on('data', dataCallback);
    doc.on('end', endCallback);

    //// PAGE DE GARDE 
    doc.image('pdf_background.jpg', 0, 0, { width: 611 })
    doc.image('logo_white_min.png', 250, 650, { fit: [100, 100], align: 'center' })
    doc
        .font("Helvetica-Bold")
        .fontSize(40)
        .fillColor('white')
        .text(
            'PROPOSITION DE SIGNALISATION', 55, 200, {
            width: 500,
            align: 'center'
        }
        );

    doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor('white')
        .text(project.company, 55, 50, {
            width: 500,
            align: 'center'
        })

    doc
        .font("Helvetica")
        .fontSize(20)
        .fillColor('white')
        .text(project.name, 55, 300, {
            width: 500,
            align: 'center'
        })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 
    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(40)
        .text(
            'PRÉAMBULE', 55, 225, {
            width: 500,
            align: 'center'
        }
        );
    doc
        .font("Helvetica")
        .fontSize(14)
        .text(
            "Le présent document, édité par la société SignAI, a pour but d’aider et d’aiguiller « WarmUpDays » ainsi que tous les porteurs du projet dans la réalisation et la conception d’un aménagement urbain dans le but de fluidifier le trafic routier de la zone indiquer sur notre plateforme.\n\nCes propositions de signalisations sont proposées par une intelligence artificielle, supervisé par l’équipe de SignAI, en prenant en compte plusieurs paramètres comme la signalisation déjà existante, ou les données de circulation réelles."
            , 55
            , 300, {
            width: 500,
            align: 'justify'
        }
        );

    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(40)
        .text(
            'SOMMAIRE', 55, 120, {
            width: 500,
            align: 'center'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fontSize(14)
        .text(
            "Préambule ……………………………………………………………………… 2\n\n\n\nSommaire ………………………………………………………………………. 3\n\n\n\nDescription …………………………………………………………………….. 4\n\n\n\nÉtapes du projet ………………………………………………………………. 4\n\n\n\nDétails du projet ………………………………………………………………. 5\n\n\n\nRésultats après le passage de l’IA ………………………………………… 6\n\n\n\nAmélioration suites aux propositions de l’IA ……………………………. 7\n\n\n\nContact …………………………………………………………………………. 8"
            , 60
            , 200, {
            width: 500,
            align: 'center'
        }
        );

    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Description', 55, 60, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            project.description, 55, 90, {
            width: 500,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Étapes du projet', 55, 160, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Création", 100, 200, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Le projet est créé par notre équipe et validé par vos soins, cette étape permet de vérifier que SignAI dispose de toute les informations nécessaire afin de bien pouvoir diagnostiquer les causes des ralentissements/embouteillages, et ainsi vous montrer les meilleurs propositions d'optimisations d'emplacement des panneaux de signalisations que notre intélligence artificielle aura trouvé.",
            100, 220, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Exécution", 100, 340, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Notre intelligence artificelle va chercher à comprendre les raisons des ralentissements et proposer des solutions afin de résoudre ses problèmes. Grâce à la carte que notre équipe lui aura fourni, et les données réeles des traffic routiers que l'on aura receulli sur une semaine, elle va verifier que la solution proposer fonctionne qu'elle que soit le traffic.",
            100, 360, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Vérification", 100, 510, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Notre équipe d’expert SignAI, va vérifier les résultats fournis par notre intelligence artificielle afin de vous proposer les meilleurs propositions de signalisation.",
            100, 530, {
            width: 450,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Terminé", 100, 620, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            "Vous retrouvez ce rapport ainsi que le carte interactive sur votre tableau de bord, et recevez un exemplaire par mail.",
            100, 640, {
            width: 450,
            align: 'justify'
        }
        );



    doc.font("Helvetica").fontSize(10).fillColor('grey').text(project.company + ' - ' + project.name, 30, 760, {
        width: 550,
        align: 'left'
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text(doc.bufferedPageRange().count, 30, 760, {
        width: 550,
        align: 'right'
    })

    //////////////////////////////////////////////////////////////////////////////////////////////////////// Nouvelle page 

    doc.addPage({
        margins: {
            top: 0,
            bottom: 0,
            left: 72,
            right: 72
        }
    })
    doc.font("Helvetica").fontSize(10).fillColor('grey').text('SignAI - Proposition de signalisation', 55, 20, {
        width: 500,
        align: 'center'
    })

    doc
        .font("Helvetica-Bold")
        .fillColor('black')
        .fontSize(20)
        .text(
            'Détails du projet', 55, 60, {
            width: 500,
            align: 'left'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Adresse de départ : ' + project.departAddress +"\n                                 (" + project.longitude +", " + project.latitude +")", 55, 90, {
            width: 500,
            align: 'justify'
        }
        );
    doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Rayon d\'action : ' + project.radius+" mètres", 55, 130, {
            width: 500,
            align: 'justify'
        }
        );
        doc
        .font("Helvetica")
        .fillColor('black')
        .fontSize(14)
        .text(
            'Contraintes: ' + (project.contraints.length == 0 ? 'Pas de contraintes indiqué' : ''), 55, 155, {
            width: 500,
            align: 'justify'
        }
        );
    project.contraints.forEach(element => {
        doc
            .font("Helvetica")
            .fillColor('black')
            .fontSize(14)
            .text(
                element.type + ': ' + element.longitude + " / " + element.latitude, {
                width: 410,
                indent: 14,
                lineGap: 7,
                align: 'left'
            }
            );
    });
    doc.end();
}

module.exports = { buildPDF };