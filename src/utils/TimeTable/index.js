/*jshint -W079*/

'use strict';
export const syncScrollInit = function (exports) {
    let Width = 'Width';
    let Height = 'Height';
    let Top = 'Top';
    let Left = 'Left';
    let scroll = 'scroll';
    let client = 'client';
    let EventListener = 'EventListener';
    let addEventListener = 'add' + EventListener;
    let length = 'length';
    let Math_round = Math.round;

    let names = {};

    let reset = function () {
        let elems = document.getElementsByClassName('sync' + scroll);

        // clearing existing listeners
        let i, j, el, found, name;
        for (name in names) {
            if (names.hasOwnProperty(name)) {
                for (i = 0; i < names[name][length]; i++) {
                    names[name][i]['remove' + EventListener](scroll, names[name][i].syn, 0);
                }
            }
        }

        // setting-up the new listeners
        for (i = 0; i < elems[length]; ) {
            found = j = 0;
            el = elems[i++];
            if (!(name = el.getAttribute('name'))) {
                // name attribute is not set
                continue;
            }

            el = el[scroll + 'er'] || el; // needed for intence

            // searching for existing entry in array of names;
            // searching for the element in that entry
            for (; j < (names[name] = names[name] || [])[length]; ) {
                found |= names[name][j++] === el;
            }

            if (!found) {
                names[name].push(el);
            }

            el.eX = el.eY = 0;

            (function (el, name) {
                el[addEventListener](
                    scroll,
                    (el.syn = function () {
                        let elems = names[name];

                        let scrollX = el[scroll + Left];
                        let scrollY = el[scroll + Top];

                        let xRate = scrollX / (el[scroll + Width] - el[client + Width]);
                        let yRate = scrollY / (el[scroll + Height] - el[client + Height]);

                        let updateX = scrollX !== el.eX;
                        let updateY = scrollY !== el.eY;

                        let otherEl,
                            i = 0;

                        el.eX = scrollX;
                        el.eY = scrollY;

                        for (; i < elems[length]; ) {
                            otherEl = elems[i++];
                            if (otherEl !== el) {
                                if (
                                    updateX &&
                                    Math_round(
                                        otherEl[scroll + Left] -
                                            (scrollX = otherEl.eX = Math_round(
                                                xRate * (otherEl[scroll + Width] - otherEl[client + Width]),
                                            )),
                                    )
                                ) {
                                    otherEl[scroll + Left] = scrollX;
                                }

                                if (
                                    updateY &&
                                    Math_round(
                                        otherEl[scroll + Top] -
                                            (scrollY = otherEl.eY = Math_round(
                                                yRate * (otherEl[scroll + Height] - otherEl[client + Height]),
                                            )),
                                    )
                                ) {
                                    otherEl[scroll + Top] = scrollY;
                                }
                            }
                        }
                    }),
                    0,
                );
            })(el, name);
        }
    };

    if (document.readyState === 'complete') {
        reset();
    } else {
        window[addEventListener]('load', reset, 0);
    }

    exports.reset = reset;
};

const syncscroll = {};

syncScrollInit(syncscroll);

let Timetable = function () {
    this.scope = {
        hourStart: 9,
        hourEnd: 17,
    };
    this.usingTwelveHour = false;
    this.locations = [];
    this.events = [];
};

Timetable.Renderer = function (tt) {
    if (!(tt instanceof Timetable)) {
        throw new Error('Initialize renderer using a Timetable');
    }
    this.timetable = tt;
};

(function () {
    function isValidHourRange(start, end) {
        return isValidHour(start) && isValidHour(end);
    }
    function isValidHour(number) {
        return isInt(number) && isInHourRange(number);
    }
    function isInt(number) {
        return number === parseInt(number, 10);
    }
    function isInHourRange(number) {
        return number >= 0 && number < 24;
    }
    function locationExistsIn(loc, locs) {
        return locs.indexOf(loc) !== -1;
    }
    function isValidTimeRange(start, end) {
        let correctTypes = start instanceof Date && end instanceof Date;
        let correctOrder = start < end;
        return correctTypes && correctOrder;
    }
    function getDurationHours(startHour, endHour) {
        return endHour >= startHour ? endHour - startHour : 24 + endHour - startHour;
    }

    Timetable.prototype = {
        setScope: function (start, end) {
            if (isValidHourRange(start, end)) {
                this.scope.hourStart = start;
                this.scope.hourEnd = end;
            } else {
                throw new RangeError('Timetable scope should consist of (start, end) in whole hours from 0 to 23');
            }

            return this;
        },
        useTwelveHour: function () {
            this.usingTwelveHour = true;
        },
        addLocations: function (newLocations) {
            function hasProperFormat() {
                return newLocations instanceof Array;
            }

            let existingLocations = this.locations;

            if (hasProperFormat()) {
                newLocations.forEach(function (loc) {
                    if (!locationExistsIn(loc, existingLocations)) {
                        existingLocations.push(loc);
                    } else {
                        throw new Error('Location already exists');
                    }
                });
            } else {
                throw new Error('Tried to add locations in wrong format');
            }

            return this;
        },
        addEvent: function (name, location, start, end, options) {
            if (!locationExistsIn(location, this.locations)) {
                throw new Error('Unknown location');
            }
            if (!isValidTimeRange(start, end)) {
                throw new Error('Invalid time range: ' + JSON.stringify([start, end]));
            }

            let optionsHasValidType = Object.prototype.toString.call(options) === '[object Object]';

            this.events.push({
                name: name,
                location: location,
                startDate: start,
                endDate: end,
                options: optionsHasValidType ? options : undefined,
            });

            return this;
        },
    };

    function emptyNode(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function prettyFormatHour(hour, usingTwelveHour) {
        let prettyHour;
        if (usingTwelveHour) {
            let period = hour >= 12 ? 'PM' : 'AM';
            prettyHour = ((hour + 11) % 12) + 1 + ':00' + period;
        } else {
            let prefix = hour < 10 ? '0' : '';
            prettyHour = prefix + hour + ':00';
        }
        return prettyHour;
    }

    Timetable.Renderer.prototype = {
        draw: function (selector) {
            let timetable = this.timetable;

            function checkContainerPrecondition(container) {
                if (container === null) {
                    throw new Error('Timetable container not found');
                }
            }
            function appendTimetableAside(container) {
                let asideNode = container.appendChild(document.createElement('aside'));
                let asideULNode = asideNode.appendChild(document.createElement('ul'));
                appendRowHeaders(asideULNode);
            }
            function appendRowHeaders(ulNode) {
                for (let k = 0; k < timetable.locations.length; k++) {
                    let liNode = ulNode.appendChild(document.createElement('li'));
                    let spanNode = liNode.appendChild(document.createElement('span'));
                    spanNode.className = 'row-heading';
                    spanNode.textContent = timetable.locations[k];
                }
            }
            function appendTimetableSection(container) {
                let sectionNode = container.appendChild(document.createElement('section'));
                let headerNode = appendColumnHeaders(sectionNode);
                let timeNode = sectionNode.appendChild(document.createElement('time'));
                timeNode.className = 'syncscroll';
                timeNode.setAttribute('name', 'scrollheader');
                let width = headerNode.scrollWidth + 'px';
                appendTimeRows(timeNode, width);
            }
            function appendColumnHeaders(node) {
                let headerNode = node.appendChild(document.createElement('header'));
                headerNode.className = 'syncscroll';
                headerNode.setAttribute('name', 'scrollheader');
                let headerULNode = headerNode.appendChild(document.createElement('ul'));

                let completed = false;
                let looped = false;

                for (let hour = timetable.scope.hourStart; !completed; ) {
                    let liNode = headerULNode.appendChild(document.createElement('li'));
                    let spanNode = liNode.appendChild(document.createElement('span'));
                    spanNode.className = 'time-label';
                    spanNode.textContent = prettyFormatHour(hour, timetable.usingTwelveHour);

                    if (
                        hour === timetable.scope.hourEnd &&
                        (timetable.scope.hourStart !== timetable.scope.hourEnd || looped)
                    ) {
                        completed = true;
                    }
                    if (++hour === 24) {
                        hour = 0;
                        looped = true;
                    }
                }
                return headerNode;
            }
            function appendTimeRows(node, width) {
                let ulNode = node.appendChild(document.createElement('ul'));
                ulNode.style.width = width;
                ulNode.className = 'room-timeline';
                for (let k = 0; k < timetable.locations.length; k++) {
                    let liNode = ulNode.appendChild(document.createElement('li'));
                    appendLocationEvents(timetable.locations[k], liNode); /**/
                }
            }
            function appendLocationEvents(location, node) {
                for (let k = 0; k < timetable.events.length; k++) {
                    let event = timetable.events[k];
                    if (event.location === location) {
                        appendEvent(event, node);
                    }
                }
            }
            function appendEvent(event, node) {
                let hasOptions = event.options !== undefined;
                let hasURL,
                    hasAdditionalClass,
                    hasDataAttributes,
                    hasClickHandler = false;

                if (hasOptions) {
                    hasURL = event.options.url !== undefined;
                    hasAdditionalClass = event.options.class !== undefined;
                    hasDataAttributes = event.options.data !== undefined;
                    hasClickHandler = event.options.onClick !== undefined;
                }

                let elementType = hasURL ? 'a' : 'span';
                let eventNode = node.appendChild(document.createElement(elementType));
                let smallNode = eventNode.appendChild(document.createElement('small'));
                eventNode.title = event.name;

                if (hasURL) {
                    eventNode.href = event.options.url;
                }

                if (hasDataAttributes) {
                    for (let key in event.options.data) {
                        eventNode.setAttribute('data-' + key, event.options.data[key]);
                    }
                }

                if (hasClickHandler) {
                    eventNode.addEventListener('click', function (e) {
                        event.options.onClick(event, timetable, e);
                    });
                }

                eventNode.className = hasAdditionalClass ? 'time-entry ' + event.options.class : 'time-entry';
                eventNode.style.width = computeEventBlockWidth(event);
                eventNode.style.left = computeEventBlockOffset(event);
                smallNode.textContent = event.name;
            }
            function computeEventBlockWidth(event) {
                let start = event.startDate;
                let end = event.endDate;
                let durationHours = computeDurationInHours(start, end);
                return (durationHours / scopeDurationHours) * 100 + '%';
            }
            function computeDurationInHours(start, end) {
                return (end.getTime() - start.getTime()) / 1000 / 60 / 60;
            }
            function computeEventBlockOffset(event) {
                let scopeStartHours = timetable.scope.hourStart;
                let eventStartHours = event.startDate.getHours() + event.startDate.getMinutes() / 60;
                let hoursBeforeEvent = getDurationHours(scopeStartHours, eventStartHours);
                return (hoursBeforeEvent / scopeDurationHours) * 100 + '%';
            }

            let scopeDurationHours = getDurationHours(timetable.scope.hourStart, timetable.scope.hourEnd);
            let container = document.querySelector(selector);
            checkContainerPrecondition(container);
            emptyNode(container);
            appendTimetableAside(container);
            appendTimetableSection(container);
            syncscroll.reset();
        },
    };
})();

export default Timetable;
