import Component from '@ember/component';
import { debounce as runloopDebounce, cancel } from '@ember/runloop';
import { addObserver } from '@ember/object/observers';


const DEBOUNCE = 500;

export default Component.extend({
    instance: false,
    options: {},
    detector: null,
    debounceId: null,
    resizeCallback: null,
    showLabelOnHover : false,
    
    didInsertElement(){
        this.renderChart();
    },

    init() {
        this._super(...arguments);
        addObserver(this,'yKeys.[]','xKey', 'labels', 'resize','options.resizeBasedOnParent', this.listenChanges);
        addObserver(this, 'data.length', this.listenDataChanges);
    },
    willDestroyElement(){
        if (this.instance) {
            this.instance.on('click', null);
            this.instance.on('hover', null);
            this.instance.on('hoverOut', null);
        }
        this.destroyResizeListener();
    },
    setupResizeListener(){
        if(this.options.resizeBasedOnParent){
            this.set("detector", elementResizeDetectorMaker({
                strategy: "scroll",
                callOnAdd: false
            }));
            let resizeHandler = this.resizeHandler.bind(this);
            let cb = (...args) =>{
                if (this.debounceId != null) {
                    cancel(this.debounceId);
                }
                if(!this.isDestroyed)
                    this.set("debounceId",runloopDebounce(resizeHandler, ...args, DEBOUNCE));   
            }
            this.set("resizeCallback", cb);
            this.detector.listenTo(this.element, this.resizeCallback);
        }
    },
    resizeHandler(){
        if(!this.isDestroyed)
            this.set("debounceId",null);
        if(this.instance !== false && this.instance!== null){
            this.instance.resizeHandler();
        }
    },
    destroyResizeListener(){
        if(this.resizeCallback){
            cancel(this.debounceId);
            this.detector.removeListener(this.element, this.resizeCallback);
            if(!this.isDestroyed){
                this.set("debounceId",null);
                this.set("resizeCallback",null);
            }
        }
    },
    renderChart(){
        // Options
        this.setOptions();
        // Render chart
        this.drawChart();
        //handling the resize event
        this.destroyResizeListener();
        this.setupResizeListener();
    },
    drawChart(){
        var type = this.get('type');
        if (typeof type !== 'string') {
            return false;
        }
        type = type.toLowerCase();
        if (type === 'area') {
            this.renderArea();
        } else if (type === 'line') {
            this.renderLine();
        } else if (type === 'bar') {
            this.renderBar();
        } else if (type === 'donut') {
            this.renderDonut();
        }
    },
    setOptions: function() {
        var options = this.get('options');

        options.element = $(this.element).attr('id');
        options.data = this.get('data');
        options.ykeys = this.get('resize') ? this.get('resize') : false;

        if(this.get('resizeBasedOnParent')){
            options.resizeBasedOnParent = this.get('resizeBasedOnParent')
        }
        
        if (this.get('xKey')) {
            options.xkey = this.get('xKey');
        }

        if (this.get('yKeys')) {
            options.ykeys = this.get('yKeys');
        }

        if (this.get('labels')) {
            options.labels = this.get('labels');
        }

        if (this.get('xLabelFormat')) {
            options.xLabelFormat = this.get('xLabelFormat');
        }

        if (this.get('lineColors')) {
            options.lineColors = this.get('lineColors');
        }

        if (this.get('barColors')) {
            options.barColors = this.get('barColors');
        }

        if (this.get('lineWidth')) {
            options.lineWidth = this.get('lineWidth');
        }

        if (this.get('pointSize')) {
            options.pointSize = this.get('pointSize');
        }

        if (this.get('pointFillColors')) {
            options.pointFillColors = this.get('pointFillColors');
        }

        if (this.get('pointStrokeColors')) {
            options.pointStrokeColors = this.get('pointStrokeColors');
        }

        if (this.get('ymax')) {
            options.ymax = this.get('ymax');
        }

        if (this.get('ymin')) {
            options.ymin = this.get('ymin');
        }

        if (this.get('smooth')) {
            options.smooth = this.get('smooth');
        }

        if (this.get('hideHover')) {
            options.hideHover = this.get('hideHover');
        }

        if (this.get('parseTime')) {
            options.parseTime = this.get('parseTime');
        }

        if (this.get('units')) {
            options.units = this.get('units');
        }

        if (this.get('postUnits')) {
            options.postUnits = this.get('postUnits');
        }

        if (this.get('preUnits')) {
            options.preUnits = this.get('preUnits');
        }

        if (this.get('dateFormat')) {
            options.dateFormat = this.get('dateFormat');
        }

        if (this.get('xLabels')) {
            options.xLabels = this.get('xLabels');
        }

        if (this.get('goals')) {
            options.goals = this.get('goals');
        }

        if (this.get('goalStrokeWidth')) {
            options.goalStrokeWidth = this.get('goalStrokeWidth');
        }

        if (this.get('goalLineColors')) {
            options.goalLineColors = this.get('goalLineColors');
        }

        if (this.get('events')) {
            options.events = this.get('events');
        }

        if (this.get('eventStrokeWidth')) {
            options.eventStrokeWidth = this.get('eventStrokeWidth');
        }

        if (this.get('eventLineColors')) {
            options.eventLineColors = this.get('eventLineColors');
        }

        if (this.get('axes')) {
            options.axes = this.get('axes');
        }

        if (this.get('grid')) {
            options.grid = this.get('grid');
        }

        if (this.get('gridTextColor')) {
            options.gridTextColor = this.get('gridTextColor');
        }

        if (this.get('gridTextSize')) {
            options.gridTextSize = this.get('gridTextSize');
        }

        if (this.get('gridTextFamily')) {
            options.gridTextFamily = this.get('gridTextFamily');
        }

        if (this.get('gridTextWeight')) {
            options.gridTextWeight = this.get('gridTextWeight');
        }

        if (this.get('fillOpacity')) {
            options.fillOpacity = this.get('fillOpacity');
        }

        if (this.get('parseTime') === 0) {
            options.parseTime = false;
        }

        if (this.get('barSizeRatio')) {
            options.barSizeRatio = this.get('barSizeRatio');
        }

        if (this.get('yLabelFormat')) {
            options.yLabelFormat = function (y) { return y != Math.round(y) ? '' : y; };
        }
        //showDefault - true then it will display maximum value selected.   -false it will display nothing as selected.
        if (this.get('showDefault') !== undefined) {
            options.showDefault = this.get('showDefault');
        }
        //true - On mouseLeave it will deselect currently selected segment and call Donut deselect and callback our called Component hoverOutDonutSegCallback method
        if (this.get('isDeselectConfigured') !== undefined) {
            options.isDeselectConfigured = this.get('isDeselectConfigured');
        }
        //this is applicable only isDeselectConfigured - true
        if (this.get('defaultSelectText') !== undefined) {
            options.defaultSelectText = this.get('defaultSelectText');
        }
        //this is applicable only isDeselectConfigured - true
        if (this.get('defaultSelectData') !== undefined) {
            options.defaultSelectData = this.get('defaultSelectData');
        }
        //For the first time rendering it should my Label and My Text in Donut as selected. like All LicensedUsers and its count
        if (this.get('showMyDefaultLabelValueFirstTime') !== undefined) {
            options.showMyDefaultLabelValueFirstTime = this.get('showMyDefaultLabelValueFirstTime');
        }

        if (this.get('click')) {
            options.click = this.get('click');
        }

        if (this.get('stacked')) {
            options.stacked = this.get('stacked');
        }

        if (this.get('yLogScale')) {
            options.yLogScale = this.get('yLogScale');
        }

        this.set('options', options);
        return options;
    },
    renderArea: function() {
        var instance = window.Morris.Area(this.get('options'));
        this.set('instance', instance);
    },
    renderLine: function() {
        var instance = window.Morris.Line(this.get('options'));
        this.set('instance', instance);
    },
    renderBar: function() {
        var _this = this;
        if (this.instance) {
            this.instance.on('click', null);
        }
        var instance = window.Morris.Bar(this.get('options')).on('click', function (index, src, x, y) {
            _this.clickBarCallback?.(index, src, x, y);
        });
        this.set('instance', instance);
    },
    renderDonut: function() {
        var _this = this;
        if (this.instance) {
            this.instance.on('click', null);
            this.instance.on('hover', null);
            this.instance.on('hoverOut', null);
        }
        var instance = window.Morris.Donut(this.get('options')).on('click', function (i, row) {
            _this.clickDonutSegCallback?.(i, row);
        }).on('hover', function (i, row) {
            if(_this.showLabelOnHover && !(_this.instance.segments[i].seg[0].hasAttribute("title") || _this.instance.segments[i].seg[0].hasAttribute("droid-title"))){
                let title= `${row.label} : ${row.value}`;
                _this.instance.segments[i].seg[0].setAttribute("title",title);
            }
            _this.hoverDonutSegCallback?.(i, row);
        }).on('hoverOut', function (i, row) {
            _this.hoverOutDonutSegCallback?.(i, row);
        });
        this.set('instance', instance);
        this.attrs.donutInstance.update(instance);
    },
    listenChanges: function() {
        $(this.element).html('').prop('style', false);
        this.renderChart();
    },
    listenDataChanges: function() {
        var instance = this.get('instance');
        instance.setData(this.get('data'), this.get('defaultSelectData'), this.get('defaultSelectText'));
        this.onDataChange?.();
    }
});
