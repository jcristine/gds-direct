import Component from "../../modules/component";

export default class AreaPccSelect extends Component{
    constructor({gds, defaultPcc, pccs})
    {
        super('select.form-control default-pcc', {style : 'z-index: 9999'});

        let notSelectedMsg = 'Not selected';

        this.context.appendChild(
            new Option(notSelectedMsg, '')
        );

        pccs.map( pcc => {
            let isSelected = pcc.name === defaultPcc;
            this.context.appendChild(
                new Option(pcc.name + " - " + pcc.consolidatorName, pcc.name, isSelected, isSelected)
            );
        } );
    }
}