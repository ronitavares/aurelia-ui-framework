var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "aurelia-framework", "../../utils/ui-event"], function (require, exports, aurelia_framework_1, ui_event_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var UIToast = (function () {
        function UIToast(element) {
            this.element = element;
            this.show = true;
            this.glyph = '';
            this.timeout = 0;
        }
        UIToast.prototype.bind = function (bindingContext, overrideContext) {
            var _this = this;
            if (bindingContext)
                Object.assign(this, bindingContext);
            ui_event_1.UIEvent.queueTask(function () {
                _this.element.classList.add('ui-open');
                if (!isNaN(_this.timeout) && parseInt(_this.timeout + '') > 0) {
                    setTimeout(function () { return _this.startClose(); }, parseInt(_this.timeout + ''));
                }
            });
        };
        UIToast.prototype.startClose = function (force) {
            var _this = this;
            if (ui_event_1.UIEvent.fireEvent('close', this.element) !== false) {
                this.element.classList.remove('ui-open');
                setTimeout(function () { return aurelia_framework_1.DOM.removeNode(_this.element); }, 500);
            }
            return true;
        };
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIToast.prototype, "show", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIToast.prototype, "glyph", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIToast.prototype, "timeout", void 0);
        UIToast = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.customElement('ui-toast'),
            aurelia_framework_1.inlineView("<template class=\"ui-toast\" click.trigger=\"startClose()\"><div class=\"ui-wrapper\">\n  <ui-glyph glyph.bind=\"glyph\"></ui-glyph>\n  <span class=\"ui-message\"><slot><slot></span><span class=\"ui-close\">&times;</span>\n</div></template>"),
            __metadata("design:paramtypes", [Element])
        ], UIToast);
        return UIToast;
    }());
    exports.UIToast = UIToast;
    var UIAlert = (function () {
        function UIAlert(element) {
            this.element = element;
            this.glyph = '';
            this.okLabel = 'OK';
            this.cancelLabel = 'Cancel';
            this.confirm = false;
            this.confirm = element.hasAttribute('confirm');
        }
        UIAlert.prototype.bind = function (bindingContext, overrideContext) {
            var _this = this;
            if (bindingContext)
                Object.assign(this, bindingContext);
            ui_event_1.UIEvent.queueTask(function () {
                _this.element.classList.add('ui-open');
                if (_this.focusBlock)
                    _this.focusBlock.focus();
            });
        };
        UIAlert.prototype.closeAlert = function (b) {
            var _this = this;
            this.element.classList.remove('ui-open');
            setTimeout(function () {
                if (_this.closeCallback)
                    _this.closeCallback(b);
                aurelia_framework_1.DOM.removeNode(_this.element);
            }, 100);
        };
        UIAlert.prototype.cancelBlur = function ($event) {
            $event.preventDefault();
            this.focusBlock.focus();
            return false;
        };
        UIAlert.prototype.checkKey = function ($event) {
            var key = ($event.keyCode || $event.which);
            if (key == 13)
                this.closeAlert(true);
            if (key == 27)
                this.closeAlert(false);
        };
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIAlert.prototype, "glyph", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIAlert.prototype, "okLabel", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIAlert.prototype, "cancelLabel", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIAlert.prototype, "closeCallback", void 0);
        UIAlert = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.inlineView("<template class=\"ui-alert-shim\"><div class=\"ui-alert\">\n  <div class=\"ui-wrapper\">\n  <input style=\"position:absolute;opacity:0;\" ref=\"focusBlock\" keydown.trigger=\"checkKey($event)\" blur.trigger=\"cancelBlur($event)\"/>\n  <ui-glyph glyph.bind=\"glyph\" class.bind=\"glyph\" if.bind=\"glyph\"></ui-glyph>\n  <span class=\"ui-message\"><slot><slot></span></div>\n  <div class=\"ui-button-bar\"><button click.trigger=\"closeAlert(true)\" t.bind=\"okLabel\">${okLabel}</button><button show.bind=\"confirm\" click.trigger=\"closeAlert(false)\" t.bind=\"cancelLabel\">${cancelLabel}</button></div>\n  </div></template>"),
            aurelia_framework_1.customElement('ui-alert'),
            __metadata("design:paramtypes", [Element])
        ], UIAlert);
        return UIAlert;
    }());
    exports.UIAlert = UIAlert;
    var UIPrompt = (function () {
        function UIPrompt(element) {
            this.element = element;
            this.glyph = '';
            this.okLabel = 'OK';
            this.cancelLabel = 'Cancel';
            this.changed = false;
            this.multiline = false;
            this.value = '';
            this.multiline = element.hasAttribute('multiline');
        }
        UIPrompt.prototype.bind = function (bindingContext, overrideContext) {
            var _this = this;
            if (bindingContext)
                Object.assign(this, bindingContext);
            ui_event_1.UIEvent.queueTask(function () {
                _this.element.classList.add('ui-open');
                if (_this.focusBlock)
                    _this.focusBlock.focus();
            });
        };
        UIPrompt.prototype.closeAlert = function (b) {
            var _this = this;
            if (b && isEmpty(this.value))
                return this.changed = true;
            this.element.classList.remove('ui-open');
            setTimeout(function () {
                if (_this.closeCallback)
                    _this.closeCallback(b ? _this.value : null);
                aurelia_framework_1.DOM.removeNode(_this.element);
            }, 100);
        };
        UIPrompt.prototype.cancelBlur = function ($event) {
            $event.preventDefault();
            this.focusBlock.focus();
            return false;
        };
        UIPrompt.prototype.checkKey = function ($event) {
            var key = ($event.keyCode || $event.which);
            if (!this.multiline && key == 13)
                this.closeAlert(true);
            if (key == 27)
                this.closeAlert(false);
            return true;
        };
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIPrompt.prototype, "glyph", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIPrompt.prototype, "okLabel", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIPrompt.prototype, "cancelLabel", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], UIPrompt.prototype, "closeCallback", void 0);
        UIPrompt = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_framework_1.inlineView("<template class=\"ui-alert-shim\"><div class=\"ui-alert\">\n  <div class=\"ui-wrapper\">\n  <ui-glyph glyph.bind=\"glyph\" class.bind=\"glyph\" if.bind=\"glyph\"></ui-glyph>\n  <span class=\"ui-message\"><slot><slot></span></div>\n  <ui-input-group>\n    <ui-input class=\"${changed && value==''?'ui-invalid':''}\" errors.bind=\"changed && value==''?['Value needed']:null\" if.bind=\"!multiline\" ref=\"focusBlock\" value.bind=\"value\" keydown.trigger=\"checkKey($event)\" blur.trigger=\"cancelBlur($event)\"></ui-input>\n    <ui-textarea class=\"${changed && value==''?'ui-invalid':''}\" errors.bind=\"changed && value==''?['Value needed']:null\" if.bind=\"multiline\" rows=\"4\" ref=\"focusBlock\" value.bind=\"value\" keydown.trigger=\"checkKey($event)\" blur.trigger=\"cancelBlur($event)\"></ui-textarea>\n  </ui-input-group>\n  <div class=\"ui-button-bar\"><button click.trigger=\"closeAlert(true)\" t.bind=\"okLabel\">${okLabel}</button><button click.trigger=\"closeAlert(false)\" t.bind=\"cancelLabel\">${cancelLabel}</button></div>\n  </div></template>"),
            aurelia_framework_1.customElement('ui-prompt'),
            __metadata("design:paramtypes", [Element])
        ], UIPrompt);
        return UIPrompt;
    }());
    exports.UIPrompt = UIPrompt;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVsZW1lbnRzL2NvbXBvbmVudHMvdWktYWxlcnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQWNBO1FBQ0UsaUJBQW1CLE9BQWdCO1lBQWhCLFlBQU8sR0FBUCxPQUFPLENBQVM7WUFZdkIsU0FBSSxHQUFHLElBQUksQ0FBQztZQUNaLFVBQUssR0FBRyxFQUFFLENBQUM7WUFDWCxZQUFPLEdBQUcsQ0FBQyxDQUFDO1FBZGUsQ0FBQztRQUV4QyxzQkFBSSxHQUFKLFVBQUssY0FBc0IsRUFBRSxlQUF1QjtZQUFwRCxpQkFRQztZQVBDLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQztnQkFBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUN4RCxrQkFBTyxDQUFDLFNBQVMsQ0FBQztnQkFDaEIsS0FBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsT0FBTyxDQUFDLElBQUksUUFBUSxDQUFDLEtBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUQsVUFBVSxDQUFDLGNBQU0sT0FBQSxLQUFJLENBQUMsVUFBVSxFQUFFLEVBQWpCLENBQWlCLEVBQUUsUUFBUSxDQUFDLEtBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkUsQ0FBQztZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQztRQU1PLDRCQUFVLEdBQWxCLFVBQW1CLEtBQU07WUFBekIsaUJBTUM7WUFMQyxFQUFFLENBQUMsQ0FBQyxrQkFBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ3ZELElBQUksQ0FBQyxPQUFPLENBQUMsU0FB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Wiw4QkFBVSxDQUFDLHVpQ0FTUSxDQUFDO1lBQ3BCLGlDQUFhLENBQUMsV0FBVyxDQUFDOzZDQUVHLE9BQU87V0FEeEIsUUFBUSxDQWdEcEI7UUFBRCxlQUFDO0tBaERELEFBZ0RDLElBQUE7SUFoRFksNEJBQVEiLCJmaWxlIjoiZWxlbWVudHMvY29tcG9uZW50cy91aS1hbGVydHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvL1xuLy8gQGRlc2NyaXB0aW9uIDpcbi8vIEBhdXRob3IgICAgICA6IEFkYXJzaCBQYXN0YWtpYVxuLy8gQGNvcHlyaWdodCAgIDogMjAxN1xuLy8gQGxpY2Vuc2UgICAgIDogTUlUXG5pbXBvcnQgeyBhdXRvaW5qZWN0LCBjdXN0b21FbGVtZW50LCBiaW5kYWJsZSwgYmluZGluZ01vZGUsIGlubGluZVZpZXcsIERPTSB9IGZyb20gJ2F1cmVsaWEtZnJhbWV3b3JrJztcbmltcG9ydCB7IFVJRXZlbnQgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdWktZXZlbnRcIjtcblxuQGF1dG9pbmplY3QoKVxuQGN1c3RvbUVsZW1lbnQoJ3VpLXRvYXN0JylcbkBpbmxpbmVWaWV3KGA8dGVtcGxhdGUgY2xhc3M9XCJ1aS10b2FzdFwiIGNsaWNrLnRyaWdnZXI9XCJzdGFydENsb3NlKClcIj48ZGl2IGNsYXNzPVwidWktd3JhcHBlclwiPlxuICA8dWktZ2x5cGggZ2x5cGguYmluZD1cImdseXBoXCI+PC91aS1nbHlwaD5cbiAgPHNwYW4gY2xhc3M9XCJ1aS1tZXNzYWdlXCI+PHNsb3Q+PHNsb3Q+PC9zcGFuPjxzcGFuIGNsYXNzPVwidWktY2xvc2VcIj4mdGltZXM7PC9zcGFuPlxuPC9kaXY+PC90ZW1wbGF0ZT5gKVxuZXhwb3J0IGNsYXNzIFVJVG9hc3Qge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgZWxlbWVudDogRWxlbWVudCkgeyB9XG5cbiAgYmluZChiaW5kaW5nQ29udGV4dDogT2JqZWN0LCBvdmVycmlkZUNvbnRleHQ6IE9iamVjdCkge1xuICAgIGlmIChiaW5kaW5nQ29udGV4dCkgT2JqZWN0LmFzc2lnbih0aGlzLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgVUlFdmVudC5xdWV1ZVRhc2soKCkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VpLW9wZW4nKTtcbiAgICAgIGlmICghaXNOYU4odGhpcy50aW1lb3V0KSAmJiBwYXJzZUludCh0aGlzLnRpbWVvdXQgKyAnJykgPiAwKSB7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5zdGFydENsb3NlKCksIHBhcnNlSW50KHRoaXMudGltZW91dCArICcnKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBAYmluZGFibGUoKSBzaG93ID0gdHJ1ZTtcbiAgQGJpbmRhYmxlKCkgZ2x5cGggPSAnJztcbiAgQGJpbmRhYmxlKCkgdGltZW91dCA9IDA7XG5cbiAgcHJpdmF0ZSBzdGFydENsb3NlKGZvcmNlPykge1xuICAgIGlmIChVSUV2ZW50LmZpcmVFdmVudCgnY2xvc2UnLCB0aGlzLmVsZW1lbnQpICE9PSBmYWxzZSkge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ3VpLW9wZW4nKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4gRE9NLnJlbW92ZU5vZGUodGhpcy5lbGVtZW50KSwgNTAwKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuQGF1dG9pbmplY3QoKVxuQGlubGluZVZpZXcoYDx0ZW1wbGF0ZSBjbGFzcz1cInVpLWFsZXJ0LXNoaW1cIj48ZGl2IGNsYXNzPVwidWktYWxlcnRcIj5cbiAgPGRpdiBjbGFzcz1cInVpLXdyYXBwZXJcIj5cbiAgPGlucHV0IHN0eWxlPVwicG9zaXRpb246YWJzb2x1dGU7b3BhY2l0eTowO1wiIHJlZj1cImZvY3VzQmxvY2tcIiBrZXlkb3duLnRyaWdnZXI9XCJjaGVja0tleSgkZXZlbnQpXCIgYmx1ci50cmlnZ2VyPVwiY2FuY2VsQmx1cigkZXZlbnQpXCIvPlxuICA8dWktZ2x5cGggZ2x5cGguYmluZD1cImdseXBoXCIgY2xhc3MuYmluZD1cImdseXBoXCIgaWYuYmluZD1cImdseXBoXCI+PC91aS1nbHlwaD5cbiAgPHNwYW4gY2xhc3M9XCJ1aS1tZXNzYWdlXCI+PHNsb3Q+PHNsb3Q+PC9zcGFuPjwvZGl2PlxuICA8ZGl2IGNsYXNzPVwidWktYnV0dG9uLWJhclwiPjxidXR0b24gY2xpY2sudHJpZ2dlcj1cImNsb3NlQWxlcnQodHJ1ZSlcIiB0LmJpbmQ9XCJva0xhYmVsXCI+XFwke29rTGFiZWx9PC9idXR0b24+PGJ1dHRvbiBzaG93LmJpbmQ9XCJjb25maXJtXCIgY2xpY2sudHJpZ2dlcj1cImNsb3NlQWxlcnQoZmFsc2UpXCIgdC5iaW5kPVwiY2FuY2VsTGFiZWxcIj5cXCR7Y2FuY2VsTGFiZWx9PC9idXR0b24+PC9kaXY+XG4gIDwvZGl2PjwvdGVtcGxhdGU+YClcbkBjdXN0b21FbGVtZW50KCd1aS1hbGVydCcpXG5leHBvcnQgY2xhc3MgVUlBbGVydCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5jb25maXJtID0gZWxlbWVudC5oYXNBdHRyaWJ1dGUoJ2NvbmZpcm0nKTtcbiAgfVxuXG4gIC8vIGF1cmVsaWEgaG9va3NcbiAgLy8gY3JlYXRlZChvd25pbmdWaWV3OiBWaWV3LCBteVZpZXc6IFZpZXcpIHsgfVxuICBiaW5kKGJpbmRpbmdDb250ZXh0OiBPYmplY3QsIG92ZXJyaWRlQ29udGV4dDogT2JqZWN0KSB7XG4gICAgaWYgKGJpbmRpbmdDb250ZXh0KSBPYmplY3QuYXNzaWduKHRoaXMsIGJpbmRpbmdDb250ZXh0KTtcbiAgICBVSUV2ZW50LnF1ZXVlVGFzaygoKSA9PiB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgndWktb3BlbicpO1xuICAgICAgaWYgKHRoaXMuZm9jdXNCbG9jaykgdGhpcy5mb2N1c0Jsb2NrLmZvY3VzKCk7XG4gICAgfSk7XG4gIH1cbiAgLy8gYXR0YWNoZWQoKSB7IH1cbiAgLy8gZGV0YWNoZWQoKSB7IH1cbiAgLy8gdW5iaW5kKCkgeyB9XG4gIC8vIGVuZCBhdXJlbGlhIGhvb2tzXG5cbiAgQGJpbmRhYmxlKCkgZ2x5cGggPSAnJztcbiAgQGJpbmRhYmxlKCkgb2tMYWJlbCA9ICdPSyc7XG4gIEBiaW5kYWJsZSgpIGNhbmNlbExhYmVsID0gJ0NhbmNlbCc7XG4gIEBiaW5kYWJsZSgpIGNsb3NlQ2FsbGJhY2s7XG5cbiAgcHJpdmF0ZSBjb25maXJtID0gZmFsc2U7XG4gIHByaXZhdGUgZm9jdXNCbG9jaztcblxuICBjbG9zZUFsZXJ0KGIpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgndWktb3BlbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2xvc2VDYWxsYmFjaykgdGhpcy5jbG9zZUNhbGxiYWNrKGIpO1xuICAgICAgRE9NLnJlbW92ZU5vZGUodGhpcy5lbGVtZW50KTtcbiAgICB9LCAxMDApO1xuICB9XG4gIGNhbmNlbEJsdXIoJGV2ZW50KSB7XG4gICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgdGhpcy5mb2N1c0Jsb2NrLmZvY3VzKCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGNoZWNrS2V5KCRldmVudCkge1xuICAgIGxldCBrZXkgPSAoJGV2ZW50LmtleUNvZGUgfHwgJGV2ZW50LndoaWNoKTtcbiAgICBpZiAoa2V5ID09IDEzKSB0aGlzLmNsb3NlQWxlcnQodHJ1ZSk7XG4gICAgaWYgKGtleSA9PSAyNykgdGhpcy5jbG9zZUFsZXJ0KGZhbHNlKTtcbiAgfVxufVxuXG5AYXV0b2luamVjdCgpXG5AaW5saW5lVmlldyhgPHRlbXBsYXRlIGNsYXNzPVwidWktYWxlcnQtc2hpbVwiPjxkaXYgY2xhc3M9XCJ1aS1hbGVydFwiPlxuICA8ZGl2IGNsYXNzPVwidWktd3JhcHBlclwiPlxuICA8dWktZ2x5cGggZ2x5cGguYmluZD1cImdseXBoXCIgY2xhc3MuYmluZD1cImdseXBoXCIgaWYuYmluZD1cImdseXBoXCI+PC91aS1nbHlwaD5cbiAgPHNwYW4gY2xhc3M9XCJ1aS1tZXNzYWdlXCI+PHNsb3Q+PHNsb3Q+PC9zcGFuPjwvZGl2PlxuICA8dWktaW5wdXQtZ3JvdXA+XG4gICAgPHVpLWlucHV0IGNsYXNzPVwiXFwke2NoYW5nZWQgJiYgdmFsdWU9PScnPyd1aS1pbnZhbGlkJzonJ31cIiBlcnJvcnMuYmluZD1cImNoYW5nZWQgJiYgdmFsdWU9PScnP1snVmFsdWUgbmVlZGVkJ106bnVsbFwiIGlmLmJpbmQ9XCIhbXVsdGlsaW5lXCIgcmVmPVwiZm9jdXNCbG9ja1wiIHZhbHVlLmJpbmQ9XCJ2YWx1ZVwiIGtleWRvd24udHJpZ2dlcj1cImNoZWNrS2V5KCRldmVudClcIiBibHVyLnRyaWdnZXI9XCJjYW5jZWxCbHVyKCRldmVudClcIj48L3VpLWlucHV0PlxuICAgIDx1aS10ZXh0YXJlYSBjbGFzcz1cIlxcJHtjaGFuZ2VkICYmIHZhbHVlPT0nJz8ndWktaW52YWxpZCc6Jyd9XCIgZXJyb3JzLmJpbmQ9XCJjaGFuZ2VkICYmIHZhbHVlPT0nJz9bJ1ZhbHVlIG5lZWRlZCddOm51bGxcIiBpZi5iaW5kPVwibXVsdGlsaW5lXCIgcm93cz1cIjRcIiByZWY9XCJmb2N1c0Jsb2NrXCIgdmFsdWUuYmluZD1cInZhbHVlXCIga2V5ZG93bi50cmlnZ2VyPVwiY2hlY2tLZXkoJGV2ZW50KVwiIGJsdXIudHJpZ2dlcj1cImNhbmNlbEJsdXIoJGV2ZW50KVwiPjwvdWktdGV4dGFyZWE+XG4gIDwvdWktaW5wdXQtZ3JvdXA+XG4gIDxkaXYgY2xhc3M9XCJ1aS1idXR0b24tYmFyXCI+PGJ1dHRvbiBjbGljay50cmlnZ2VyPVwiY2xvc2VBbGVydCh0cnVlKVwiIHQuYmluZD1cIm9rTGFiZWxcIj5cXCR7b2tMYWJlbH08L2J1dHRvbj48YnV0dG9uIGNsaWNrLnRyaWdnZXI9XCJjbG9zZUFsZXJ0KGZhbHNlKVwiIHQuYmluZD1cImNhbmNlbExhYmVsXCI+XFwke2NhbmNlbExhYmVsfTwvYnV0dG9uPjwvZGl2PlxuICA8L2Rpdj48L3RlbXBsYXRlPmApXG5AY3VzdG9tRWxlbWVudCgndWktcHJvbXB0JylcbmV4cG9ydCBjbGFzcyBVSVByb21wdCB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50OiBFbGVtZW50KSB7XG4gICAgdGhpcy5tdWx0aWxpbmUgPSBlbGVtZW50Lmhhc0F0dHJpYnV0ZSgnbXVsdGlsaW5lJyk7XG4gIH1cblxuICAvLyBhdXJlbGlhIGhvb2tzXG4gIC8vIGNyZWF0ZWQob3duaW5nVmlldzogVmlldywgbXlWaWV3OiBWaWV3KSB7IH1cbiAgYmluZChiaW5kaW5nQ29udGV4dDogT2JqZWN0LCBvdmVycmlkZUNvbnRleHQ6IE9iamVjdCkge1xuICAgIGlmIChiaW5kaW5nQ29udGV4dCkgT2JqZWN0LmFzc2lnbih0aGlzLCBiaW5kaW5nQ29udGV4dCk7XG4gICAgVUlFdmVudC5xdWV1ZVRhc2soKCkgPT4ge1xuICAgICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3VpLW9wZW4nKTtcbiAgICAgIGlmICh0aGlzLmZvY3VzQmxvY2spIHRoaXMuZm9jdXNCbG9jay5mb2N1cygpO1xuICAgIH0pO1xuICB9XG4gIC8vIGF0dGFjaGVkKCkgeyB9XG4gIC8vIGRldGFjaGVkKCkgeyB9XG4gIC8vIHVuYmluZCgpIHsgfVxuICAvLyBlbmQgYXVyZWxpYSBob29rc1xuXG4gIEBiaW5kYWJsZSgpIGdseXBoID0gJyc7XG4gIEBiaW5kYWJsZSgpIG9rTGFiZWwgPSAnT0snO1xuICBAYmluZGFibGUoKSBjYW5jZWxMYWJlbCA9ICdDYW5jZWwnO1xuICBAYmluZGFibGUoKSBjbG9zZUNhbGxiYWNrO1xuXG4gIHByaXZhdGUgY2hhbmdlZCA9IGZhbHNlO1xuICBwcml2YXRlIG11bHRpbGluZSA9IGZhbHNlO1xuICBwcml2YXRlIGZvY3VzQmxvY2s7XG4gIHByaXZhdGUgdmFsdWUgPSAnJztcblxuICBjbG9zZUFsZXJ0KGIpIHtcbiAgICBpZiAoYiAmJiBpc0VtcHR5KHRoaXMudmFsdWUpKSByZXR1cm4gdGhpcy5jaGFuZ2VkID0gdHJ1ZTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgndWktb3BlbicpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY2xvc2VDYWxsYmFjaykgdGhpcy5jbG9zZUNhbGxiYWNrKGIgPyB0aGlzLnZhbHVlIDogbnVsbCk7XG4gICAgICBET00ucmVtb3ZlTm9kZSh0aGlzLmVsZW1lbnQpO1xuICAgIH0sIDEwMCk7XG4gIH1cbiAgY2FuY2VsQmx1cigkZXZlbnQpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLmZvY3VzQmxvY2suZm9jdXMoKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgY2hlY2tLZXkoJGV2ZW50KSB7XG4gICAgbGV0IGtleSA9ICgkZXZlbnQua2V5Q29kZSB8fCAkZXZlbnQud2hpY2gpO1xuICAgIGlmICghdGhpcy5tdWx0aWxpbmUgJiYga2V5ID09IDEzKSB0aGlzLmNsb3NlQWxlcnQodHJ1ZSk7XG4gICAgaWYgKGtleSA9PSAyNykgdGhpcy5jbG9zZUFsZXJ0KGZhbHNlKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==
