import Component from "../../modules/component";

export default class AreaPccSelect extends Component{
    constructor({gds, defaultPcc, pccs, disabled})
    {
        super('select.form-control default-pcc', {style : 'z-index: 9999'});

        let notSelectedMsg = 'Not selected';
        if (disabled) {
            this.getContext().setAttribute('disabled', 'disabled');
            notSelectedMsg = {
                apollo: '2F3K - ITN Corp',
                galileo: '711M - ITN Corp',
                sabre: '6IIF - ITN Corp',
                amadeus: 'SFO1S2195 - ITN Corp',
            }[gds] || 'Home PCC';
        }

        this.context.appendChild(
            new Option(notSelectedMsg, '')
        );

        pccs.map( pcc => {
            this.context.appendChild(
                new Option(pcc.name + " - " + pcc.consolidatorName, pcc.name, pcc.name === defaultPcc, pcc.name === defaultPcc)
            )
        } );
    }
}