import Component from "../../modules/component";

export default class AreaPccSelect extends Component{
    constructor({gds, defaultPcc, pccs})
    {
        super('select.form-control default-pcc', {style : 'z-index: 9999'});

        let notSelectedMsg = 'Not selected';

        this.context.appendChild(
            new Option(notSelectedMsg, '')
        );

        pccs.map( pccRow => {
            let isSelected = pccRow.name === defaultPcc;
            this.context.appendChild(
                new Option(pccRow.pcc + " - " + pccRow.consolidator, pccRow.pcc, isSelected, isSelected)
            );
        } );
    }
}