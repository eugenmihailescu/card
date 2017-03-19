var Mynix_FlipCard = (function($) {

    var UNDEF = 'undefined';

    // an object that contains the instance setup
    var data = null;

    // an object that points to the card brand logo images; the object keys are:
    // {path:url,format:png|jpg|etc,img:{visa:name.format,maestro:name.format,mastercard:name.format,..}}
    var card_logos = null;

    // the path where card's logos can be found by default
    var logo_default_path = 'assets/img/';

    // the default image format of the card's logos
    var logo_default_format = 'png';

    // predefined styles by card brand name
    // a style element has the following structure:
    // - key=style name and should match the card brand key
    // - value is an object with the following keys: bg=background-color, fg=color,
    // top=top-color,logo:{position=`bottom`|xxxpx|xxx%}
    var card_styles = {
        visaelectron : {
            bg : '#005594'
        },
        maestro : {
            bg : '#4883C5',
            top : '#6fa6ff',
            logo : {
                position : 'bottom'
            }
        },
        forbrugsforeningen : {
            bg : '#E6E5EA',
            fg : '#000000'
        },
        dankort : {
            bg : '#977979'
        },
        elo : {
            bg : '#423a50',
            top : '#695c8a',
            logo : {
                position : 'bottom'
            }
        },
        visa : {},
        mastercard : {
            bg : '#113070',
            top : '#3852AA',
            logo : {
                position : 'bottom'
            }
        },
        amex : {
            bg : '#1A8F72'
        },
        dinersclub : {
            bg : '#8D8D8D'
        },
        discover : {
            bg : '#5A869F',
            top : '#81a8d9'
        },
        unionpay : {
            bg : '#154A98',
            top : '#3C6CD2',
            logo : {
                position : 'bottom'
            }
        },
        jcb : {
            bg : '#002F75'
        }
    };

    // default card `fancy lines` style
    var line_style = {
        lines_down : {
            before : {
                'border-top-color' : '%rgb1%',
                'box-shadow' : '1px 1px 100px ' + '%rgb2%',
                'background-color' : '%rgb%',
                'background' : '-moz-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%)',
                'background' : '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, %rgba%), color-stop(100%, %rgb%))',
                'background' : '-webkit-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%)',
                'background' : '-o-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%)',
                'background' : '-ms-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%)',
                'background' : 'radial-gradient(ellipse at center, %rgba% 44%, %rgb% 100%)',
                'filter' : 'progid: DXImageTransform.Microsoft.gradient(startColorstr="%rgba%", endColorstr="%rgb%", GradientType=1)'
            },
            after : {
                'border-top-color' : '%rgb1%',
                'box-shadow' : 'inset -1px -1px 44px %rgb2%',
                'background-color' : '%rgb%',
                'background' : '-moz-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%)',
                'background' : '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, %rgba%), color-stop(100%, %rgb%))',
                'background' : '-webkit-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%)',
                'background' : '-o-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%)',
                'background' : '-ms-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%)',
                'background' : 'radial-gradient(ellipse at center, %rgba% 44%, %rgb% 100%)',
                'filter' : 'progid: DXImageTransform.Microsoft.gradient(startColorstr="%rgba%", endColorstr="%rgb%", GradientType=1)'
            }
        },
        lines_up : {
            before : {
                'border-bottom-color' : '%rgb1%',
                'box-shadow' : 'inset 1px 1px 44px %rgb3%',
                'background-color' : '%rgb3%',
                'background' : '-moz-radial-gradient(center, ellipse cover, %rgb3% 100%, %rgb4% 100%);',
                'background' : '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, %rgb3%), color-stop(100%, %rgb4%));',
                'background' : '-webkit-radial-gradient(center, ellipse cover, %rgb3% 100%, %rgb4% 100%);',
                'background' : '-o-radial-gradient(center, ellipse cover, %rgb3% 44%, %rgb4% 100%);',
                'background' : '-ms-radial-gradient(center, ellipse cover, %rgb3% 44%, %rgb4% 100%);',
                'background' : 'radial-gradient(ellipse at center, %rgb3% 44%, %rgb4% 100%);',
                'filter' : 'progid: DXImageTransform.Microsoft.gradient(startColorstr="%rgb3%", endColorstr="%rgb4%", GradientType=1);'
            },
            after : {
                'border-bottom-color' : '%rgb3%',
                'box-shadow' : 'inset 1px 1px 44px %rgb3%',
                'background-color' : '%rgb%',
                'background' : '-moz-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%);',
                'background' : '-webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%, %rgba%), color-stop(100%, %rgb%));',
                'background' : '-webkit-radial-gradient(center, ellipse cover, %rgba% 100%, %rgb% 100%);',
                'background' : '-o-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%);',
                'background' : '-ms-radial-gradient(center, ellipse cover, %rgba% 44%, %rgb% 100%);',
                'background' : 'radial-gradient(ellipse at center, %rgba% 44%, %rgb% 100%);',
                'filter' : 'progid: DXImageTransform.Microsoft.gradient(startColorstr="%rgba%", endColorstr="%rgb%", GradientType=1);'
            }
        }
    };

    var flip_status = '0';// current flip direction in degrees
    var flip_back = '-180';// back face flip direction in degrees

    /**
     * Event to update the card on inputs change updates
     * 
     * @param {Object}
     *            item - The element that triggered the change event
     */
    var onInputChange = function(item) {
        var sel = $(this), val = item.target.value;

        if (UNDEF === typeof val)
            return;

        // make sure we preserve the space take by the field, even when empty
        val.length || (val = $(this).attr('placeholder'));
        val.length || (val = '\t');

        if (sel.is($(data.number))) {
            $('.card-number').html(val);
            $('.first-digits').html(val.substr(0, 4));
        }
        if (sel.is($(data.expiry))) {
            $('.card-expiry').html(val);
        }
        if (sel.is($(data.cvv))) {
            $('.card-cvc').html(val);
        }
        if (sel.is($(data.owner))) {
            $('.card-owner').html($(data.owner).map(function() {
                return $(this).val();
            }).get().join(' '));
        }
    };

    /**
     * Event when the CVV input element gains focus
     */
    var onCVVFocusIn = function() {
        flip_card(flip_back);
    };

    /**
     * Event when the CVV input loses focus
     */
    var onCVVFocusOut = function() {
        flip_card('0');// flip to front
    };

    var onFocusInFrontSide = function() {
        flip_card('0');// flip to front
    };

    /**
     * Event when the card type was changed
     * 
     * @param {Object}
     *            sender - The sender of the event
     * @param {String}
     *            cardType - The new type of the card
     */
    var onCardTypeChange = function(sender, cardType) {
        setCardStyle(cardType);
    };

    /**
     * Event that triggers when a certain condition was change such that it requires the card to flip in one direction or
     * other.
     * 
     * @param {Object}
     *            sender - The sender of the event
     * @param {number}
     *            degree - The number of degree to flip the card
     */
    var onCardFlipChange = function(sender, degree) {
        flip_back = degree;
    };

    /**
     * Event when the card color has to be changed
     * 
     * @param {Object}
     *            sender - The sender of the event
     * @param {String}
     *            color- The new color of the card
     */
    var onCardColorChange = function(sender, color) {
        changeBaseColor(color);
    };

    /**
     * Event when the card's top color has to be changed
     * 
     * @param {Object}
     *            sender - The sender of the event
     * @param {String}
     *            color- The new top color of the card
     */
    var onCardTopColorChange = function(sender, color) {
        $('.card-brand-wrapper').css({
            'background-color' : color
        });
    };

    /**
     * Get the current card's style
     * 
     * @returns {String} Returns the card's style
     */
    function get_card_styles() {
        return card_styles;
    }

    /**
     * Converts a hex color to a RGB object
     * 
     * @param hex
     *            The color code in hex format
     * @return An RGB object
     */
    function hextorgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r : parseInt(result[1], 16),
            g : parseInt(result[2], 16),
            b : parseInt(result[3], 16)
        } : null;
    }

    /**
     * Converts a hex color to its JavaScript rgb() representation
     * 
     * @param hex
     *            The color code in hex format
     * @return A string containing the JavaScript function that returns the color
     */
    function hex2rgb(hex) {
        var c = hextorgb(hex);
        return 'rgb(' + c.r + ',' + c.g + ',' + c.b + ')';
    }

    /**
     * Converts a hex color to its JavaScript rgba() representation
     * 
     * @param hex
     *            The color code in hex format
     * @param a
     *            The opacity
     * @return A string containing the JavaScript function that returns the color
     */
    function hex2rgba(hex, a) {
        var c = hextorgb(hex);

        a = UNDEF === typeof a ? 0 : a;

        return 'rgba(' + c.r + ',' + c.g + ',' + c.b + ',' + a + ')';
    }

    /**
     * Converts the rgb tupple to a hex color string
     * 
     * @param r
     *            The red color component
     * @param g
     *            The green color component
     * @param b
     *            The blue color component
     * @return The hex color code as string
     */
    function rgb2hex(r, g, b) {
        var c2hex = function(c) {
            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
        };
        return "#" + c2hex(r) + c2hex(g) + c2hex(b);
    }

    /**
     * Fixes a r,g,b component such that it is withing 0.255 range
     * 
     * @param value
     *            The r,g or b component value
     * @return int Returns the color component fixed value
     */
    function fixRgb(value) {
        return Math.max(0, Math.min(value, 255));
    }

    /**
     * Derivates a new custom style based on the given color
     * 
     * @param name
     *            The name of the custom style to add to HEAD
     * @param color
     *            The base color to use as a strarting point
     */
    function addStyle(name, color) {
        function a(pseudo) {
            var result = '', c = hextorgb(color), rgb = hex2rgb(color), rgba = hex2rgba(color, 0);
            var r = {
                rgb1 : 'rgb(' + fixRgb(c.r + 12) + ',' + fixRgb(c.g + 12) + ',' + fixRgb(c.b + 12) + ')',
                rgb2 : 'rgb(' + fixRgb(c.r + 19) + ',' + fixRgb(c.g + 20) + ',' + fixRgb(c.b + 12) + ')',
                rgb3 : 'rgb(' + fixRgb(c.r + 19) + ',' + fixRgb(c.g + 19) + ',' + fixRgb(c.b + 12) + ')',
                rgb4 : 'rgb(' + fixRgb(c.r - 10) + ',' + fixRgb(c.g - 10) + ',' + fixRgb(c.b - 10) + ')'
            };

            $.each(line_style[name][pseudo], function(key, value) {
                $.each(r, function(k, v) {
                    value = value.replace('%' + k + '%', v);
                });
                result += key + ':' + value.replace('%rgba%', rgba).replace('%rgb%', rgb) + ';'
            });
            return result;
        }

        var sbt = a('before'), sat = a('after');

        $('#' + name + '-custom').remove();
        $(
                "<style id='" + name + "-custom' type='text/css'>." + name + "-custom:before{" + sbt + "}." + name
                        + "-custom:after {" + sat + "}</style>").appendTo("head");
    }

    /**
     * Change the look and feel of the card based on the given color
     * 
     * @param color
     *            The hex color code
     */
    function changeBaseColor(color) {
        $('.lines-down').removeClass('lines_down-custom');
        $('.lines-up').removeClass('lines_up-custom');

        if (UNDEF === typeof color)
            return;
        var c = hextorgb(color), base;

        if (null == c)
            return;

        base = rgb2hex(fixRgb(c.r + 20), fixRgb(c.g + 15), fixRgb(c.b + 46));

        $('.card-front, .card-back, .card-face.card-back').css({
            'background-color' : color,
            'border' : '1px solid rgb(' + fixRgb(c.r + 5) + ',' + fixRgb(c.g + 3) + ',' + fixRgb(c.b + 12) + ')'
        });

        addStyle('lines_down', base);
        $('.lines-down').addClass('lines_down-custom');

        addStyle('lines_up', base);
        $('.lines-up').addClass('lines_up-custom');
    }

    /**
     * Flips the card either back or forward based on the given direction
     * 
     * @param direction
     *            The value in degrees to rotate the card around Y-axis
     */
    function flip_card(direction) {
        if (direction == flip_status)
            return;

        flip_status = direction;

        $('.card-wrapper .the-card').css({
            '-webkit-transform' : 'rotateY(' + direction + 'deg)',
            '-ms-transform' : 'rotateY(' + direction + 'deg)',
            'transform' : 'rotateY(' + direction + 'deg)'
        });
    }

    /**
     * Sets the card style based on a predefined set of styles
     * 
     * @param name
     *            The name of the card/predefined style
     */
    function setCardStyle(name) {
        var logo_img = $('.card-brand img');

        logo_img.hide();

        // set the card's logo either by using the custom card_logos object or using the default images
        if ('unknown' != name) {
            var path = logo_default_path, format = logo_default_format, src = path + name + '.' + logo_default_format;

            if (null !== card_logos && UNDEF !== typeof card_logos) {
                if (card_logos.hasOwnProperty('path')) {
                    path = card_logos.path;
                }
                if (card_logos.hasOwnProperty('format')) {
                    format = card_logos.format;
                }
                if (card_logos.hasOwnProperty('img') && card_logos.img.hasOwnProperty(name)) {
                    src = path + card_logos.img[name];
                }
            }

            logo_img.show();

        }

        // set the card style (if exists) based on the given name
        if (card_styles.hasOwnProperty(name)) {
            // set to default
            changeBaseColor('#191278');

            if (card_styles[name].hasOwnProperty('bg')) {
                changeBaseColor(card_styles[name].bg);
            } else {
                // soft reset
                changeBaseColor();
            }
            var top = card_styles[name].hasOwnProperty('top') ? card_styles[name].top : '#ffffff';
            $('.card-brand-wrapper').css({
                'background-color' : top
            });

            var fg = card_styles[name].hasOwnProperty('fg') ? card_styles[name].fg : '#ffffff';
            $('.card-front,.card-back').css({
                'color' : fg
            });

            var logo_pos = '5%';
            if (card_styles[name].hasOwnProperty('logo') && card_styles[name].logo.hasOwnProperty('position')) {
                logo_pos = card_styles[name].logo.position;
            }

            $('.card-brand').css({
                'margin-top' : 'bottom' == logo_pos ? '40%' : logo_pos
            });
        }

        logo_img.attr({
            'src' : src
        });
    }

    /**
     * Initializes the class by the given data. Binds its events to the DOM elements.
     * 
     * @param options
     *            An object of tupples which provide the selectors for the source INPUT elements (eg. key:selector). The
     *            change event of these input selectors will be bound to the card internal CSS classes, as bellow:
     * 
     * {number-selector:.card-number, expiry-selector:.card-expiry, cvv-selector:.card-cvc, owner-selector : .card-owner}
     * 
     * Furthermore, it contains an `card_logos` object which provides a custom set of images to use as card's logos:
     * 
     * -path:url to images folder, format:the image format (eg. png), img:array of images for each card brand where the key is
     * the card type and the value is the card image name (without path)
     * 
     */
    function init(options) {
        if (UNDEF === typeof options || !options) {
            return;
        }

        data = options;

        if (data.hasOwnProperty('card_logos')) {
            card_logos = data.card_logos;
        }

        // event to sync card number
        $(data.number + ',' + data.expiry + ',' + data.cvv + ',' + data.owner)
                .on('keyup keypress blur change', onInputChange).trigger('keypress');

        // flip card back
        $(data.cvv).on('focusin', onCVVFocusIn).on('blur', onCVVFocusOut);

        // flip card front
        $(data.number + ',' + data.expiry + ',' + data.owner).on('focusin', onFocusInFrontSide);

        // automatically set card style by external event
        $('body').on('payment.cardType', onCardTypeChange).on('payment.cardFlipDegree', onCardFlipChange).on(
                'payment.cardBaseColor', onCardColorChange).on('payment.cardTopColor', onCardTopColorChange);
    }

    /**
     * Unbinds from the DOM the events bounded during initialization.
     */
    function finalize() {
        if (!data) {
            return;
        }

        $(data.number + ',' + data.expiry + ',' + data.cvv + ',' + data.owner).off('keyup keypress blur change',
                onInputChange);

        $(data.number + ',' + data.expiry + ',' + data.owner).off('focusin', onFocusInFrontSide);

        $(data.cvv).off('focusin', onCVVFocusIn).off('blur', onCVVFocusOut);

        $('body').off('payment.cardType', onCardTypeChange).off('payment.cardFlipDegree', onCardFlipChange).off(
                'payment.cardBaseColor', onCardColorChange).off('payment.cardTopColor', onCardTopColorChange);
    }

    return {
        init : init,
        finalize : finalize,
        get_card_styles : get_card_styles
    };

})(jQuery);