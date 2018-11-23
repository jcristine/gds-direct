import App 	    from 'application';
import User     from 'abstract/user';
import Moment   from 'moment';

import {dispatch, getState} from "es6!../store";
import {getLang} from "es6!../language";
import {TOUR_HOTEL_UPDATE, TOUR_HOTEL_SET, TOUR_DATE_SET} from "es6!../actions/common";
import {TOUR_CITY_SET, TOUR_SET, CLICK_EVENT} from "es6!../actions/common";

const Dom 		= require('abstract/dom_builder');
const flat 		= require('lib/flatpickr.min');

const Component = App.components.create;

const createGenericOptions = (startsFromValue, singularText, pluralText) => {
	const res = [];
	let text;

	for (let i = startsFromValue; i < 10; i++)
	{
		text = i < 2 ? singularText : pluralText;
		text = i + ' ' + text;

		res.push( new Option(text, i) );
	}

	return res;
};

const onChange = key => e => dispatch(TOUR_SET, {key, value : e.target.value});
const onRender = key => ( {tour, errors}, inst) => {
	inst.context.value = tour[key];
	inst.context.classList.toggle('is-error', !!errors[key] && !tour[key]);
};

const getHotelAccommodation = () => {
	return (App.get('lead') ? App.get('lead').needHotelAccommodation : false)
};


let datePickerElem;

export const HotelWrap = () => {
	const isNbRoomsHidden = User.agent.getCompany() !== 'SLT' ? 'hidden' : '';

	return Component('div.clearfix m-t', {style : 'padding: 10px 5px; box-shadow: 1px 1px 3px #eaeaea; border: 1px solid #eae8e8;'})

		.observeEl([
		    Component('div.clearfix')
                .observeEl([
                    Component('div.col-md-5')
                        .attach(
                            Component(`span.hotel-title font-weight-bold[${getLang('hotel')}]`)
                        ),

                    Component('div.col-md-7')
                        .observeEl(
                            Component('div.pq-city')
                                .observeEl([
                                    Component({
                                        context: 'label.label label-success',
                                    })
                                        .observeEl(
                                            Component('span')
                                                .assignRender( ({tour, errors}, inst) => {
                                                    inst.context.innerHTML = tour.city.label;
                                                } )
                                        )
                                        .observeEl(
                                            Component({
                                                context : 'i.close[x]',
                                                props: {
                                                    onclick : e => dispatch(TOUR_CITY_SET, {id: '', label: ''})
                                                }
                                            })
                                        )
                                        .assignRender( ({tour, errors}, inst) => {
                                            inst.context.classList.toggle('hidden', !tour.city.id);
                                        }),

                                    Component({
                                        context : 'input.pq-city-input form-control input-sm',
                                        props 	: {
                                            placeholder 	: getLang('selectCity')
                                        },
                                        _mount : ({context}) => {
                                            Dom.modules.autoComplete.make2(context, {
                                                lookupUrl			: 'autoComplete?cities=1',
                                                onSelectCallback 	: (e, {item}) => dispatch(TOUR_CITY_SET, item)
                                            });
                                        }
                                    }).assignRender( ({tour,errors}, inst) => {
                                        inst.context.classList.toggle('hidden', tour.city.id);
                                        inst.context.value = tour.city.label;
                                    })
                                ]).assignRender( ({tour, errors}, inst) => {
                                    inst.context.classList.toggle('is-error', !!errors['hotelCityId']);
                                })
                        )
                ]),

            Component('div.clearfix')
                .observeEl([
                    Component('div.col-md-12 m-b-sm m-t-lg')
                        .observeEl(
                            Component({
                                context: 'div.pq-hotels',
                                props: {
                                    onclick : e => dispatch(CLICK_EVENT, {key: 'inputfocus', value: true})
                                }
                            }).observeEl([
                                Component('label.search')
                                    .observeEl(
                                        Component('span')
                                            .assignRender( ({tour, errors}, inst) => {
                                                inst.context.innerHTML = tour.city.id ?
                                                    getLang('searchIn') + " " + tour.city.label.split(',')[0] :
                                                    getLang('searchIn') + " ..";
                                            } )
                                    ),
                                Component('label.label')
                                    .observeEl(
                                        Component('span.pq-hotel-ac-text')
                                            .assignRender( ({tour, errors}, inst) => {
                                                inst.context.innerHTML = tour.hotel.name;
                                            } )
                                    )
                                    .observeEl(
                                        Component({
                                            context : 'i.close[x]',
                                            props: {
                                                onclick : e => dispatch(TOUR_HOTEL_UPDATE, {id: '', name: '', address: ''})
                                            }
                                        })
                                    )
                                    .assignRender( ({tour, errors}, inst) => {
                                        inst.context.classList.toggle('hidden', !tour.hotel.name);
                                    }),

                                Component({
                                    context : 'input.form-control input-sm',
                                    props   : {
                                        placeholder : getLang('hotelName')
                                    },
                                    _mount : _this => {
                                        _this.ac = Dom.modules.autoComplete.pqHotels(_this.context, {
                                            lookupUrl           : 'autoComplete?hotels=1',
                                            onSelectCallback 	: (e, {item}) => dispatch(TOUR_HOTEL_SET, item)
                                        });

                                        _this.context.onfocusout = e => {
                                            if (!getState().tour.hotel.id)
                                            {
                                                dispatch(TOUR_HOTEL_UPDATE, {id: 0, name: e.target.value});
                                            }

                                            dispatch(CLICK_EVENT, {key: 'inputfocus', value: false});
                                        };
                                    }
                                }).assignRender( ({tour, errors}, inst) => {
                                    inst.ac.changeUrl('autoComplete?hotels=1&cityId=' + tour.city.id);

                                    tour.hotel.inputfocus ? inst.context.focus() : '';

                                    inst.context.value = tour.hotel.name;
                                    inst.context.disabled = !!tour.hotel.randomHotel;
                                    inst.context.classList.toggle('hidden', tour.hotel.name);
                                } )
                            ]).assignRender( ({tour, errors}, inst) => {
                                inst.context.classList.toggle('disabled', !!tour.hotel.randomHotel);
                                inst.context.classList.toggle('is-error', !!errors['hotelId'] && !tour.hotel.randomHotel);
                            } )
                        ),

                Component('div.col-md-12 m-b-sm m-t-sm')
                    .observeEl(
                        Component('input.form-control input-sm', {
                            placeholder : getLang('hotelAddress'),
                            onchange 	: e => dispatch(TOUR_HOTEL_UPDATE, {address : e.target.value})
                        }).assignRender( ({tour, errors}, inst) => {
                            onRender('hotelAddress')({tour, errors}, inst);
                            inst.context.classList.toggle('is-error', !!errors['hotelId'] && !tour.hotel.randomHotel);
                            inst.context.disabled = !!tour.hotel.address || !! tour.hotel.name || !!tour.hotel.randomHotel;
                            inst.context.value = tour.hotel.address;
                        } )
                    ),

                Component('div.col-md-12 m-b-lg m-t-sm')
                    .observeEl(
                        Component('div.checkbox')
                            .observeEl(
                                Component('label')
                                    .observeEl([
                                        Component({
                                            context: 'input',
                                            props: {
                                                type: 'checkbox',
                                                disabled : getHotelAccommodation()
                                            },
                                            _mount: ({context}) => {
                                                let randomHotel = 0;

                                                context.onchange = e => {
                                                    randomHotel = context.checked ? 1 : 0;
                                                    dispatch(TOUR_HOTEL_UPDATE, {randomHotel: randomHotel})

                                                    if (randomHotel) {
														const   dateFrom    = Moment(datePickerElem.selectedDates[0]),
															    dateTo      = Moment(dateFrom).add(5, 'days')

														dispatch(TOUR_DATE_SET, [dateFrom, dateTo])
                                                    }
                                                };
                                            }
                                        })
                                            .assignRender( ({tour}, inst) => {
                                                inst.context.checked    = tour.hotel.randomHotel === 1
												inst.context.disabled   = getHotelAccommodation()
                                            } ),
                                        Component('span')
                                            .assignRender( ({tour}, inst) => {
                                                inst.context.innerHTML = "Add random hotel. I confirm that customer will not use it."
                                            } )
                                    ])
                            )
                    )
            ]),

            Component('div.col-md-12 pq-hotels-line'),

            Component('div.clearfix').observeEl([
                Component('div.col-md-3 m-t-lg m-b-sm')
                    .observeEl(
                        Component('select.form-control input-sm', {onchange : onChange('adults')})
                            .append(createGenericOptions(1, 'adult', 'adults'))
                            .assignRender(({tour, errors}, inst) => onRender('adults')({tour, errors}, inst))
                    ),

                Component('div.col-md-3 m-t-lg m-b-sm')
                    .observeEl(
                        Component('select.form-control input-sm', {
                            placeholder : getLang('children'),
                            onchange 	: onChange('children')
                        })
                            .append( createGenericOptions(0, 'child', 'children')  )
                            .assignRender( ({tour, errors}, inst) => onRender('children')({tour, errors}, inst))
                    ),

                Component('div.col-md-3 m-t-lg m-b-sm')
                    .observeEl(
                        Component('select.form-control input-sm ' + isNbRoomsHidden, {onchange : onChange('rooms')})
                            .append( createGenericOptions(1, 'room', 'rooms') )
                            .assignRender( ({tour, errors}, inst) => onRender('rooms')({tour, errors}, inst))
                    )
            ]),

            Component('div.col-md-6 m-b-lg')
                .observeEl(
                    Component({
                        context : 'input.form-control input-sm',
                        props	: {
                            style           : 'background-color: #fff',
                            placeholder 	: getLang('datesPlaceholder')
                        },

                        _mount : _this => {
							datePickerElem = _this.flatpicker = flat(_this.context, {
                                minDate 	: 'today',
                                mode		: "range",
                                onClose 	: dates => dispatch(TOUR_DATE_SET, dates)
                            });
                        }
                    }).assignRender( ( {tour = {}, errors}, _this) => {
                        const {checkIn, checkOut} = tour.date;
                        const isDate = checkIn !== null && checkOut !== null;

                        _this.flatpicker.setDate([checkIn, checkOut], true);
                        _this.context.value = isDate? `${checkIn} to ${checkOut}` : '';
                        _this.context.classList.toggle('is-error', !!errors['dates']);
                    })
                )

		])
		.assignRender((state, _this) => {
			const isHotel = state.isTourFare && state.canTour;
			_this.context.classList.toggle('hidden', !isHotel);
		});
};