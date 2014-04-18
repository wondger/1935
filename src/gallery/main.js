(function() {
  KISSY.add(function(S, Node, Event, UA) {
    var $, DragSwitch, abs, cPrefix, cleanMatrix, defaultConfig, disableTransition, getMatrix, getTransition, jPrefix, parseMartix, restoreMatrixState, restoreTransition, saveMatrixState, setMatrix, setTransition, translate;
    $ = KISSY.all;
    abs = Math.abs;
    if (UA.webkit) {
      cPrefix = "-webkit-";
      jPrefix = "webkit";
    } else if (UA.firefox) {
      cPrefix = "-moz-";
      jPrefix = "moz";
    } else if (UA.ie) {
      cPrefix = "-ms-";
      jPrefix = "ms";
    } else {
      cPrefix = jPrefix = "";
    }
    defaultConfig = {
      senDistance: 1,
      angle: Math.PI / 4,
      checkEnabled: null,
      disable: false,
      binds: [
        null, null, null, null, {
          moveSelf: true,
          moveEls: [],
          maxDistance: 99999,
          validDistance: null,
          checkEnabled: null,
          friction: false,
          transition: true
        }
      ]
    };
    getMatrix = function(el) {
      return el.css("" + cPrefix + "transform");
    };
    setMatrix = function(el, matrix) {
      return el[0].style["" + jPrefix + "Transform"] = matrix;
    };
    saveMatrixState = function(els) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        _results.push(el.matrixState = getMatrix(el));
      }
      return _results;
    };
    restoreMatrixState = function(els) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        _results.push(setMatrix(el, el.matrixState));
      }
      return _results;
    };
    cleanMatrix = function(els) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        _results.push(el[0].style["" + jPrefix + "Transform"] = "");
      }
      return _results;
    };
    getTransition = function(el) {
      return el[0].style["" + jPrefix + "Transition"];
    };
    setTransition = function(el, transition) {
      return el[0].style["" + jPrefix + "Transition"] = transition;
    };
    disableTransition = function(els) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        el.transitionState = getTransition(el);
        _results.push(setTransition(el, "none"));
      }
      return _results;
    };
    restoreTransition = function(els) {
      var el, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = els.length; _i < _len; _i++) {
        el = els[_i];
        _results.push(setTransition(el, el.transitionState));
      }
      return _results;
    };
    translate = function(currentMatrix, distance, hori) {
      var matrix;
      matrix = parseMartix(currentMatrix);
      matrix[4] += distance * hori;
      matrix[5] += distance * (1 - hori);
      return "matrix(" + matrix.join(',') + ")";
    };
    parseMartix = function(currentMatrix) {
      var matrix;
      if (!currentMatrix) {
        currentMatrix = "matrix(1,0,0,1,0,0)";
      }
      matrix = currentMatrix.match(/[0-9\.\-]+/g);
      if (!matrix) {
        matrix = [1, 0, 0, 1, 0, 0];
      }
      matrix.forEach(function(item, key) {
        return matrix[key] = parseFloat(item);
      });
      return matrix;
    };
    return DragSwitch = (function() {
      function DragSwitch(el, config) {
        this.el = el;
        this.config = config;
        S.mix(this, S.Event.Target);
        this.init();
      }

      DragSwitch.prototype.init = function() {
        var item, key, value, _i, _j, _len, _len1, _ref, _ref1;
        this.config = S.merge(defaultConfig, this.config);
        this.disable = this.config.disable;
        if (typeof this.el === "string") {
          this.isSelector = true;
        }
        if (!this.isSelector) {
          this.el = $(this.el);
        }
        this.realEl = $(this.el);
        this.tanAngel = Math.tan(this.config.angle);
        _ref = this.config.binds;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          if (!item || !item.validDistance) {
            continue;
          }
          if (item.transition == null) {
            item.transition = true;
          }
          if (item.moveSelf == null) {
            item.moveSelf = true;
          }
          if (item.moveEls == null) {
            item.moveEls = [];
          }
          _ref1 = item.moveEls;
          for (key = _j = 0, _len1 = _ref1.length; _j < _len1; key = ++_j) {
            value = _ref1[key];
            item.moveEls[key] = $(value);
          }
        }
        return this.bindEvents();
      };

      DragSwitch.prototype.bindEvents = function() {
        var _this = this;
        if (this.isSelector) {
          $('body').delegate("touchstart pointerdown mousedown", this.el, function(ev) {
            return _this.touchStart(ev);
          });
          $('body').delegate("touchmove pointermove mousemove", this.el, function(ev) {
            return _this.touchMove(ev);
          });
          return $('body').delegate("touchend pointerup mouseup", this.el, function(ev) {
            return _this.touchEnd(ev);
          });
        } else {
          this.el.on("touchstart pointerdown mousedown", function(ev) {
            return _this.touchStart(ev);
          });
          this.el.on("touchmove pointermove mousemove", function(ev) {
            return _this.touchMove(ev);
          });
          return this.el.on("touchend pointerup mouseup", function(ev) {
            return _this.touchEnd(ev);
          });
        }
      };

      DragSwitch.prototype.touchStart = function(e) {
        var ev, parent;
        if (this.disable) {
          return;
        }
        this.fire("touchStart", e);
        this.enabled = this.config.checkEnabled ? this.config.checkEnabled() : true;
        if (!this.enabled) {
          return;
        }
        ev = e.originalEvent || e;
        this.istouchStart = true;
        this.isSendStart = false;
        this.eventType = null;
        this.key = null;
        this.actuMoveEls = [];
        this.startPoint = [ev.pageX || ev.touches[0].pageX, ev.pageY || ev.touches[0].pageY];
        return this.originalEl = this.isSelector && (parent = $(ev.target).parent(this.el)) ? parent : $(ev.currentTarget);
      };

      DragSwitch.prototype.touchMove = function(e) {
        var angleDelta, distance, ev, oPoint, point,
          _this = this;
        if (!this.istouchStart) {
          return;
        }
        if (this.isSendStart && !this.effectBind) {
          return;
        }
        ev = e.originalEvent || e;
        point = [ev.pageX || ev.touches[0].pageX, ev.pageY || ev.touches[0].pageY];
        oPoint = this.startPoint;
        angleDelta = abs((oPoint[1] - point[1]) / (point[0] - oPoint[0]));
        distance = [point[0] - oPoint[0], point[1] - oPoint[1]];
        if (!this.isSendStart && angleDelta > this.tanAngel && 1 / angleDelta > this.tanAngel) {
          this.istouchStart = false;
          return;
        } else if (!this.eventType) {
          if (angleDelta <= this.tanAngel && abs(distance[0]) > this.config.senDistance) {
            this.eventType = (distance[0] > 0 ? "left" : "right");
          } else if (1 / angleDelta <= this.tanAngel && abs(distance[1]) > this.config.senDistance) {
            this.eventType = (distance[1] > 0 ? "top" : "bottom");
          } else {
            return;
          }
          this.key = (this.eventType === "top" ? 0 : (this.eventType === "right" ? 1 : (this.eventType === "bottom" ? 2 : (this.eventType === "left" ? 3 : null))));
          this.isVertical = 1 - this.key % 2;
          this.effectBind = this.config.binds[this.key];
          if (!this.effectBind) {
            return;
          }
          this.effectBind.passed = false;
          this.moveEls = this.effectBind.moveEls;
          this.actuMoveEls = this.moveEls.slice();
          if (this.effectBind.moveSelf) {
            this.actuMoveEls.push(this.originalEl);
          }
          saveMatrixState(this.actuMoveEls);
          this.enabled = (function() {
            if (_this.effectBind.checkEnabled) {
              return _this.effectBind.checkEnabled.call(_this, e);
            } else {
              return true;
            }
          })();
          disableTransition(this.actuMoveEls);
        }
        if (!this.eventType || !this.enabled || !this.effectBind) {
          return;
        }
        e.stopPropagation();
        if (!this.isSendStart) {
          this.isSendStart = true;
          this.fire(this.eventType + "BeforeMove", e);
        }
        this.fire(this.eventType + "Move", e);
        if (!e.isDefaultPrevented()) {
          e.halt();
          return this.move(point);
        }
      };

      DragSwitch.prototype.touchEnd = function(e) {
        this.istouchStart = false;
        if (!this.eventType || !this.enabled || !this.effectBind) {
          return;
        }
        if (this.isSendStart) {
          this.isSendStart = false;
          return this.touchEndHandler(e);
        }
      };

      DragSwitch.prototype.touchEndHandler = function(e) {
        restoreTransition(this.actuMoveEls);
        if (this.effectBind.transition) {
          this.transitionEndHandler(e);
        }
        if (abs(this.distance) >= abs(this.effectBind.validDistance)) {
          this.effectBind.passed = true;
          cleanMatrix(this.actuMoveEls);
          this.fire("" + this.eventType + "Passed", e);
        } else {
          restoreMatrixState(this.actuMoveEls);
          this.fire("" + this.eventType + "Failed", e);
        }
        return this.fire(this.eventType + "TouchEnd touchEnd", e);
      };

      DragSwitch.prototype.transitionEndHandler = function(e) {
        var duration, remain, speed, transitionEnd,
          _this = this;
        speed = abs(this._startPoint - this._lastPoint) / (this.startTimeS - this.lastTimeS);
        speed = Math.sqrt(speed);
        speed = speed < 4 ? 4 : speed;
        remain = abs(this.effectBind.maxDistance - this.distance);
        duration = remain / speed + "ms";
        this.actuMoveEls.forEach(function(el) {
          return setTransition(el, "" + cPrefix + "transform " + duration + " ease");
        });
        transitionEnd = function() {
          _this.fire("" + _this.eventType + "MoveEnd", e);
          restoreTransition(_this.actuMoveEls);
          return _this.actuMoveEls[0].detach("" + jPrefix + "TransitionEnd", transitionEnd);
        };
        return this.actuMoveEls[0].on("" + jPrefix + "TransitionEnd", transitionEnd);
      };

      DragSwitch.prototype.move = function(endPoint) {
        var dis, el, positiveDirt, rawDistance, _distance, _i, _len, _ref, _results;
        this.endPoint = endPoint;
        if (this.effectBind.transition) {
          this.lastTimeS = this.startTimeS ? this.startTimeS : null;
          this.startTimeS = new Date;
          this._lastPoint = this._startPoint ? this._startPoint : null;
          this._startPoint = (this.isVertical ? this.endPoint[1] : this.endPoint[0]);
        }
        _distance = (this.isVertical ? this.endPoint[1] - this.startPoint[1] : this.endPoint[0] - this.startPoint[0]);
        positiveDirt = this.key === 0 || this.key === 3;
        if (positiveDirt) {
          this.distance = _distance - this.config.senDistance;
        } else {
          this.distance = _distance + this.config.senDistance;
        }
        if (this.effectBind.friction && this.effectBind.maxDistance && abs(this.distance) > abs(this.effectBind.maxDistance)) {
          dis = Math.sqrt(abs(rawDistance - this.effectBind.maxDistance) * 5);
          if (!positiveDirt) {
            dis = -dis;
          }
          this.distance = rawDistance = this.effectBind.maxDistance + dis;
        }
        _ref = this.actuMoveEls;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          _results.push(setMatrix(el, translate(el.matrixState, this.distance, !this.isVertical)));
        }
        return _results;
      };

      return DragSwitch;

    })();
  }, {
    requires: ["node", "event", "ua"]
  });

}).call(this);
