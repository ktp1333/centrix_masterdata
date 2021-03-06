
       { $lookup: { from: 'referencevalues', localField: 'ordermodeuid', foreignField: '_id', as: 'ordermode' } },
       { $unwind: { path: '$ordermode', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: 'referencevalues', localField: 'ordercommuid', foreignField: '_id', as: 'ordercommunication' } },
       { $unwind: { path: '$ordercommunication', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: 'referencevalues', localField: 'ordertypeuid', foreignField: '_id', as: 'ordertype' } },
       { $unwind: { path: '$ordertype', preserveNullAndEmptyArrays: true } },


       { $lookup: { from: 'orderitems', localField: 'patientorderitems.orderitemuid', foreignField: '_id', as: 'orderitem' } },
       { $unwind: { path: '$orderitem', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: 'ordercategories', localField: 'orderitem.ordercatuid', foreignField: '_id', as: 'orderitemcat' } },
       { $unwind: { path: '$orderitemcat', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: 'ordercategories', localField: 'orderitem.ordersubcatuid', foreignField: '_id', as: 'orderitemsubcat' } },
       { $unwind: { path: '$orderitemsubcat', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: 'referencevalues', localField: 'patientorderitems.statusuid', foreignField: '_id', as: 'orderitemstatus' } },
       { $unwind: { path: '$orderitemstatus', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.instructionuid", foreignField: "_id", as: "instructions" } },
       { $unwind: { path: '$instructions', preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "frequencies", localField: "patientorderitems.frequencyuid", foreignField: "_id", as: "frequency" } },
       { $unwind: { path: "$frequency", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.quantityUOM", foreignField: "_id", as: "quantityUOM" } },
       { $unwind: { path: "$quantityUOM", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.routeuid", foreignField: "_id", as: "route" } },
       { $unwind: { path: "$route", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.formuid", foreignField: "_id", as: "form" } },
       { $unwind: { path: "$form", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.dosageUOM", foreignField: "_id", as: "dosageUOM" } },
       { $unwind: { path: "$dosageUOM", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.infusionrateuom", foreignField: "_id", as: "infusionrateUOM" } },
       { $unwind: { path: "$infusionrateUOM", preserveNullAndEmptyArrays: true } },
       { $lookup: { from: "referencevalues", localField: "patientorderitems.infusiondurationuom", foreignField: "_id", as: "infusiondurationuom" } },
       { $unwind: { path: "$infusiondurationuom", preserveNullAndEmptyArrays: true } },


    