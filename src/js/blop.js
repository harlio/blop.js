/*!
 * jQuery blop.js 1.2
 * Original author: @harleyjessop
 * Licensed under the MIT license
 * Dependencies:
    https://github.com/blueimp/JavaScript-Load-Image
    https://github.com/tapmodo/Jcrop
 */

;(function ($, window, document, undefined) {

    var pluginName = "blop",
        defaults = {
            blk:              ".blop",
            elZone:           "__dropzone",
            elPrev:           "__preview",
            elInput:          "__input",
            elSelBtn:         "__select",
            elClrBtn:         "__clear",
            elSetBtn:         "__set",
            elPrevImg:        "__image",
            elResult:         "__result",
            modEmpty:         "blop--empty",
            modActive:        "blop--active",
            modSet:           "blop--set",
            setWidth:         250,
            setHeight:        250,
            jcrop:            {
                aspectRatio:  1,
                minSize:      [ 25, 25 ],
                maxSize:      [ 0, 0 ],
                setSelect:    [ 0, 0, 250, 250 ],
                bgColor:      "white",
                bgOpacity:    0.3,
                api:          {}
            },
            onClearCallback:   function(){},
            onSetCallback:     function(){},
            currentFile:       null,
            coords:            null,
            cropping:          null
        };

    function Plugin(element, options) {
        this.elem = element;

        this.opt = $.extend({}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            this.bindUIActions();
        },

        bindUIActions: function() {
            var s = this;

            $(s.elem).on("dragover", s.opt.blk + s.opt.elZone, function() {
                // Required for drop to work
                return false;
            });

            $(s.elem).on("drop", s.opt.blk + s.opt.elZone, function(e) {
                e.preventDefault();
                s.handleDrop(e);
            });

            $(s.elem).on("change", s.opt.blk + s.opt.elInput, function(e) {
                s.handleDrop(e);
            });

            $(s.elem).on("click", s.opt.blk + s.opt.elClrBtn, function(e) {
                e.preventDefault();
                $(s.elem).find(s.opt.blk + s.opt.elInput).val("");
                s.showDropzone();
                $(s.elem).find(s.opt.blk + s.opt.elPrevImg).remove();

                var jcropHolder = $(s.elem).find(".jcrop-holder");
                if (jcropHolder.length > 0) {
                    // remove jcrop
                    s.opt.jcrop.api.instance.destroy();
                    jcropHolder.remove();
                }

                // Callback on clear
                s.opt.onClearCallback();
            });
            $(s.elem).on("click", s.opt.blk + s.opt.elSetBtn, function(e) {
                e.preventDefault();
                // Callback on clear
                s.setCrop();
            });
        },

        showDropzone: function() {
            var s = this;
            $(s.elem).addClass("empty");
            $(s.elem).removeClass("set active");
        },

        hideDropzone: function() {
            var s = this;
            $(s.elem).removeClass("empty");
        },

        handleDrop: function(e) {
            var s = this;
            s.hideDropzone();
            e = e.originalEvent;
            var target = e.dataTransfer || e.target,
                file = target && target.files && target.files[0];
            if (!file){
                return;
            }
            s.opt.currentFile = file;
            s.displayImg(file);
        },

        displayImg: function(file) {
            var s = this;

            if (
                !loadImage(
                    file,
                    function(img){
                        s.replaceImg(img, function(){
                            $(s.elem).addClass("active");
                            s.handleCrop(img);
                        });
                    }, {
                        canvas: true
                    }
                )){

                $(s.opt.blk + s.opt.result).children().replaceWith(
                    $("<span>Your browser does not support the URL or FileReader API. Please upgrade to a modern browser!</span>")
                );
            }
        },

        replaceImg: function(img, callback) {
            var s = this,
                content;

            if (!(img.src || img instanceof HTMLCanvasElement)) {
                content = $("<span>Loading image file failed</span>");
            } else {
                content = $(img).addClass("blop__image");
            }

            $(s.opt.blk + s.opt.elResult).html(content);
            callback(content);
        },

        handleCrop: function(img) {
            var s = this;

            s.opt.jcrop.aspectRatio = (s.opt.setWidth/s.opt.setHeight);
            s.opt.jcrop.setSelect = [0, 0, s.opt.setWidth, s.opt.setHeight];

            $(img).Jcrop({
                aspectRatio:    s.opt.jcrop.aspectRatio,
                minSize:        s.opt.jcrop.minSize,
                maxSize:        s.opt.jcrop.maxSize,
                setSelect:      s.opt.jcrop.setSelect,
                bgColor:        s.opt.jcrop.bgColor,
                bgOpacity:      s.opt.jcrop.bgOpacity,
                trueSize:       [img.width, img.height],
                boxWidth:       $(img).width(),
                boxHeight:      $(img).height(),
                onSelect:       setCoords,
                onChange:       setCoords,
                onRelease:      setCoords(null)
            }, function(){
                s.opt.jcrop.api.instance = this;
            }).parent().on("click", function (e) {
                e.preventDefault();
            });

            function setCoords(coords) {
                s.opt.coords = coords;
            }
        },

        setCrop: function() {
            var s = this,
                img = $(s.elem).find(s.opt.blk + s.opt.elResult).find("img, canvas")[0];

            if (img && s.opt.coords) {
                s.replaceImg(loadImage.scale(img, {
                    left:           s.opt.coords.x,
                    top:            s.opt.coords.y,
                    sourceWidth:    s.opt.coords.w,
                    sourceHeight:   s.opt.coords.h,
                    maxWidth:       s.opt.setWidth,
                    maxHeight:      s.opt.setHeight,
                    crop:           true
                }), function(newImg){
                    s.allDone(newImg);
                });
                s.opt.coords = null;
            }
        },

        allDone: function(img){
            var s = this;

            $(s.elem).removeClass("active").addClass("set");

            if (img.toBlob) {
                img.toBlob(
                    function(blob){
                        s.opt.onSetCallback(blob);
                    },
                    s.opt.currentFile.type, 0.6
                );
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );