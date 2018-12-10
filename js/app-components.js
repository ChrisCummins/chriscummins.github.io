/*
  * Extra plugins for enabling Flat UI components.
  *
  * Contains:
  *     jquery.placeholder.js
  *     jquery.tagsinput.js
  *     bootstrap-select.js
  *     bootstrap-switch.js
  *     flatui-checkbox.js
  *     flatui-radio.js
  *
  *     + Some general UI pack related JS
  */

/*! http://mths.be/placeholder v2.0.7 by @mathias */
;(function(window, document, $) {

  var isInputSupported = 'placeholder' in document.createElement('input'),
      isTextareaSupported = 'placeholder' in document.createElement('textarea'),
      prototype = $.fn,
      valHooks = $.valHooks,
      hooks,
      placeholder;

  if (isInputSupported && isTextareaSupported) {

    placeholder = prototype.placeholder = function() {
      return this;
    };

    placeholder.input = placeholder.textarea = true;

  } else {

    placeholder = prototype.placeholder = function() {
      var $this = this;
      $this
        .filter((isInputSupported ? 'textarea' : ':input') + '[placeholder]')
        .not('.placeholder')
        .bind({
            'focus.placeholder': clearPlaceholder,
            'blur.placeholder': setPlaceholder
          })
        .data('placeholder-enabled', true)
        .trigger('blur.placeholder');
      return $this;
    };

    placeholder.input = isInputSupported;
    placeholder.textarea = isTextareaSupported;

    hooks = {
      'get': function(element) {
        var $element = $(element);
        return $element.data('placeholder-enabled') &&
            $element.hasClass('placeholder') ? '' : element.value;
      },
      'set': function(element, value) {
        var $element = $(element);
        if (!$element.data('placeholder-enabled')) {
          return element.value = value;
        }
        if (value == '') {
          element.value = value;
          // Issue #56: Setting the placeholder causes problems if the element
          // continues to have focus.
          if (element != document.activeElement) {
            // We can't use `triggerHandler` here because of dummy text/password
            // inputs :(
            setPlaceholder.call(element);
          }
        } else if ($element.hasClass('placeholder')) {
          clearPlaceholder.call(element, true, value) ||
              (element.value = value);
        } else {
          element.value = value;
        }
        // `set` can not return `undefined`; see
        // http://jsapi.info/jquery/1.7.1/val#L2363
        return $element;
      }
    };

    isInputSupported || (valHooks.input = hooks);
    isTextareaSupported || (valHooks.textarea = hooks);

    $(function() {
      // Look for forms
      $(document).delegate('form', 'submit.placeholder', function() {
        // Clear the placeholder values so they don't get submitted
        var $inputs = $('.placeholder', this).each(clearPlaceholder);
        setTimeout(function() {
          $inputs.each(setPlaceholder);
        }, 10);
      });
    });

    // Clear placeholder values upon page reload
    $(window).bind('beforeunload.placeholder', function() {
      $('.placeholder').each(function() {
        this.value = '';
      });
    });

  }

  function args(elem) {
    // Return an object of element attributes
    var newAttrs = {},
        rinlinejQuery = /^jQuery\d+$/;
    $.each(elem.attributes, function(i, attr) {
      if (attr.specified && !rinlinejQuery.test(attr.name)) {
        newAttrs[attr.name] = attr.value;
      }
    });
    return newAttrs;
  }

  function clearPlaceholder(event, value) {
    var input = this,
        $input = $(input);
    if (input.value == $input.attr('placeholder') &&
        $input.hasClass('placeholder')) {
      if ($input.data('placeholder-password')) {
        $input = $input.hide().next().show().attr('id', $input.removeAttr('id').data('placeholder-id'));
        // If `clearPlaceholder` was called from `$.valHooks.input.set`
        if (event === true) {
          return $input[0].value = value;
        }
        $input.focus();
      } else {
        input.value = '';
        $input.removeClass('placeholder');
        input == document.activeElement && input.select();
      }
    }
  }

  function setPlaceholder() {
    var $replacement,
        input = this,
        $input = $(input),
        $origInput = $input,
        id = this.id;
    if (input.value == '') {
      if (input.type == 'password') {
        if (!$input.data('placeholder-textinput')) {
          try {
            $replacement = $input.clone().attr({ 'type': 'text' });
          } catch (e) {
            $replacement = $('<input>').attr($.extend(args(this), { 'type': 'text' }));
          }
          $replacement
            .removeAttr('name')
            .data({
                'placeholder-password': true,
                'placeholder-id': id
              })
            .bind('focus.placeholder', clearPlaceholder);
          $input
            .data({
                'placeholder-textinput': $replacement,
                'placeholder-id': id
              })
            .before($replacement);
        }
        $input = $input.removeAttr('id').hide().prev().attr('id', id).show();
        // Note: `$input[0] != input` now!
      }
      $input.addClass('placeholder');
      $input[0].value = $input.attr('placeholder');
    } else {
      $input.removeClass('placeholder');
    }
  }

}(this, document, jQuery));

!function($) {
  var Selectpicker = function(element, options, e) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.$element = $(element);
    this.$newElement = null;
    this.button = null;

    //Merge defaults, options and data-attributes to make our options
    this.options = $.extend({}, $.fn.selectpicker.defaults, this.$element.data(), typeof options == 'object' && options);

    //If we have no title yet, check the attribute 'title' (this is missed by jq as its not a data-attribute
    if (this.options.title == null)
      this.options.title = this.$element.attr('title');

    //Expose public methods
    this.val = Selectpicker.prototype.val;
    this.render = Selectpicker.prototype.render;
    this.init();
  };

  Selectpicker.prototype = {

    constructor: Selectpicker,

    init: function(e) {
      var _this = this;
      this.$element.hide();
      this.multiple = this.$element.prop('multiple');


      var classList = this.$element.attr('class') !== undefined ? this.$element.attr('class').split(/\s+/) : '';
      var id = this.$element.attr('id');
      this.$element.after(this.createView());
      this.$newElement = this.$element.next('.select');
      var select = this.$newElement;
      var menu = this.$newElement.find('.dropdown-menu');
      var menuArrow = this.$newElement.find('.dropdown-arrow');
      var menuA = menu.find('li > a');
      var liHeight = select.addClass('open').find('.dropdown-menu li > a').outerHeight();
      select.removeClass('open');
      var divHeight = menu.find('li .divider').outerHeight(true);
      var selectOffset_top = this.$newElement.offset().top;
      var size = 0;
      var menuHeight = 0;
      var selectHeight = this.$newElement.outerHeight();
      this.button = this.$newElement.find('> button');
      if (id !== undefined) {
        this.button.attr('id', id);
        $('label[for="' + id + '"]').click(function() { select.find('button#' + id).focus(); });
      }
      for (var i = 0; i < classList.length; i++) {
        if (classList[i] != 'selectpicker') {
          this.$newElement.addClass(classList[i]);
        }
      }
      //If we are multiple, then add the show-tick class by default
      if (this.multiple) {
        this.$newElement.addClass('select-multiple');
      }
      this.button.addClass(this.options.style);
      menu.addClass(this.options.menuStyle);
      menuArrow.addClass(function() {
        if (_this.options.menuStyle) {
          return _this.options.menuStyle.replace('dropdown-', 'dropdown-arrow-');
        }
      });
      this.checkDisabled();
      this.checkTabIndex();
      this.clickListener();
      var menuPadding = parseInt(menu.css('padding-top')) + parseInt(menu.css('padding-bottom')) + parseInt(menu.css('border-top-width')) + parseInt(menu.css('border-bottom-width'));
      if (this.options.size == 'auto') {
        function getSize() {
          var selectOffset_top_scroll = selectOffset_top - $(window).scrollTop();
          var windowHeight = window.innerHeight;
          var menuExtras = menuPadding + parseInt(menu.css('margin-top')) + parseInt(menu.css('margin-bottom')) + 2;
          var selectOffset_bot = windowHeight - selectOffset_top_scroll - selectHeight - menuExtras;
          menuHeight = selectOffset_bot;
          if (select.hasClass('dropup')) {
            menuHeight = selectOffset_top_scroll - menuExtras;
          }
          menu.css({'max-height' : menuHeight + 'px', 'overflow-y' : 'auto', 'min-height' : liHeight * 3 + 'px'});
        }
        getSize();
        $(window).resize(getSize);
        $(window).scroll(getSize);
        this.$element.bind('DOMNodeInserted', getSize);
      } else if (this.options.size && this.options.size != 'auto' && menu.find('li').length > this.options.size) {
        var optIndex = menu.find('li > *').filter(':not(.divider)').slice(0, this.options.size).last().parent().index();
        var divLength = menu.find('li').slice(0, optIndex + 1).find('.divider').length;
        menuHeight = liHeight * this.options.size + divLength * divHeight + menuPadding;
        menu.css({'max-height' : menuHeight + 'px', 'overflow-y' : 'scroll'});
      }

      //Listen for updates to the DOM and re render...
      this.$element.bind('DOMNodeInserted', $.proxy(this.reloadLi, this));

      this.render();
    },

    createDropdown: function() {
      var drop =
          "<div class='btn-group select'>" +
          "<i class='dropdown-arrow'></i>" +
          "<button class='btn dropdown-toggle clearfix' data-toggle='dropdown'>" +
          "<span class='filter-option pull-left'></span>&nbsp;" +
          "<span class='caret'></span>" +
          '</button>' +
          "<ul class='dropdown-menu' role='menu'>" +
          '</ul>' +
          '</div>';

      return $(drop);
    },


    createView: function() {
      var $drop = this.createDropdown();
      var $li = this.createLi();
      $drop.find('ul').append($li);
      return $drop;
    },

    reloadLi: function() {
      //Remove all children.
      this.destroyLi();
      //Re build
      $li = this.createLi();
      this.$newElement.find('ul').append($li);
      //render view
      this.render();
    },

    destroyLi: function() {
      this.$newElement.find('li').remove();
    },

    createLi: function() {

      var _this = this;
      var _li = [];
      var _liA = [];
      var _liHtml = '';

      this.$element.find('option').each(function() {
        _li.push($(this).text());
      });

      this.$element.find('option').each(function(index) {
        //Get the class and text for the option
        var optionClass = $(this).attr('class') !== undefined ? $(this).attr('class') : '';
        var text = $(this).text();
        var subtext = $(this).data('subtext') !== undefined ? '<small class="muted">' + $(this).data('subtext') + '</small>' : '';

        //Append any subtext to the main text.
        text += subtext;

        if ($(this).parent().is('optgroup') && $(this).data('divider') != true) {
          if ($(this).index() == 0) {
            //Get the opt group label
            var label = $(this).parent().attr('label');
            var labelSubtext = $(this).parent().data('subtext') !== undefined ? '<small class="muted">' + $(this).parent().data('subtext') + '</small>' : '';
            label += labelSubtext;

            if ($(this)[0].index != 0) {
              _liA.push(
                  '<div class="divider"></div>' +
                  '<dt>' + label + '</dt>' +
                  _this.createA(text, 'opt ' + optionClass)
              );
            } else {
              _liA.push(
                  '<dt>' + label + '</dt>' +
                  _this.createA(text, 'opt ' + optionClass));
            }
          } else {
            _liA.push(_this.createA(text, 'opt ' + optionClass));
          }
        } else if ($(this).data('divider') == true) {
          _liA.push('<div class="divider"></div>');
        } else {
          _liA.push(_this.createA(text, optionClass));
        }
      });

      if (_li.length > 0) {
        for (var i = 0; i < _li.length; i++) {
          var $option = this.$element.find('option').eq(i);
          _liHtml += '<li rel=' + i + '>' + _liA[i] + '</li>';
        }
      }

      //If we dont have a selected item, and we dont have a title, select the first element so something is set in the button
      if (this.$element.find('option:selected').length == 0 && !_this.options.title) {
        this.$element.find('option').eq(0).prop('selected', true).attr('selected', 'selected');
      }

      return $(_liHtml);
    },

    createA: function(test, classes) {
      return '<a tabindex="-1" href="#" class="' + classes + '">' +
          '<span class="pull-left">' + test + '</span>' +
          '</a>';

    },

    render: function() {
      var _this = this;

      //Set width of select
      if (this.options.width == 'auto') {
        var ulWidth = this.$newElement.find('.dropdown-menu').css('width');
        this.$newElement.css('width', ulWidth);
      } else if (this.options.width && this.options.width != 'auto') {
        this.$newElement.css('width', this.options.width);
      }

      //Update the LI to match the SELECT
      this.$element.find('option').each(function(index) {
        _this.setDisabled(index, $(this).is(':disabled') || $(this).parent().is(':disabled'));
        _this.setSelected(index, $(this).is(':selected'));
      });



      var selectedItems = this.$element.find('option:selected').map(function(index,value) {
        if ($(this).attr('title') != undefined) {
          return $(this).attr('title');
        } else {
          return $(this).text();
        }
      }).toArray();

      //Convert all the values into a comma delimited string
      var title = selectedItems.join(', ');

      //If this is multi select, and the selectText type is count, the show 1 of 2 selected etc..
      if (_this.multiple && _this.options.selectedTextFormat.indexOf('count') > -1) {
        var max = _this.options.selectedTextFormat.split('>');
        if ((max.length > 1 && selectedItems.length > max[1]) || (max.length == 1 && selectedItems.length >= 2)) {
          title = selectedItems.length + ' of ' + this.$element.find('option').length + ' selected';
        }
      }

      //If we dont have a title, then use the default, or if nothing is set at all, use the not selected text
      if (!title) {
        title = _this.options.title != undefined ? _this.options.title : _this.options.noneSelectedText;
      }

      this.$element.next('.select').find('.filter-option').html(title);
    },



    setSelected: function(index, selected) {
      if (selected) {
        this.$newElement.find('li').eq(index).addClass('selected');
      } else {
        this.$newElement.find('li').eq(index).removeClass('selected');
      }
    },

    setDisabled: function(index, disabled) {
      if (disabled) {
        this.$newElement.find('li').eq(index).addClass('disabled');
      } else {
        this.$newElement.find('li').eq(index).removeClass('disabled');
      }
    },

    checkDisabled: function() {
      if (this.$element.is(':disabled')) {
        this.button.addClass('disabled');
        this.button.click(function(e) {
          e.preventDefault();
        });
      }
    },

    checkTabIndex: function() {
      if (this.$element.is('[tabindex]')) {
        var tabindex = this.$element.attr('tabindex');
        this.button.attr('tabindex', tabindex);
      }
    },

    clickListener: function() {
      var _this = this;

      $('body').on('touchstart.dropdown', '.dropdown-menu', function(e) { e.stopPropagation(); });



      this.$newElement.on('click', 'li a', function(e) {
        var clickedIndex = $(this).parent().index(),
            $this = $(this).parent(),
            $select = $this.parents('.select');


        //Dont close on multi choice menu
        if (_this.multiple) {
          e.stopPropagation();
        }

        e.preventDefault();

        //Dont run if we have been disabled
        if ($select.prev('select').not(':disabled') && !$(this).parent().hasClass('disabled')) {
          //Deselect all others if not multi select box
          if (!_this.multiple) {
            $select.prev('select').find('option').removeAttr('selected');
            $select.prev('select').find('option').eq(clickedIndex).prop('selected', true).attr('selected', 'selected');
          }
          //Else toggle the one we have chosen if we are multi selet.
          else {
            var selected = $select.prev('select').find('option').eq(clickedIndex).prop('selected');

            if (selected) {
              $select.prev('select').find('option').eq(clickedIndex).removeAttr('selected');
            } else {
              $select.prev('select').find('option').eq(clickedIndex).prop('selected', true).attr('selected', 'selected');
            }
          }


          $select.find('.filter-option').html($this.text());
          $select.find('button').focus();

          // Trigger select 'change'
          $select.prev('select').trigger('change');
        }

      });

      this.$newElement.on('click', 'li.disabled a, li dt, li .divider', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $select = $(this).parent().parents('.select');
        $select.find('button').focus();
      });

      this.$element.on('change', function(e) {
        _this.render();
      });
    },

    val: function(value) {

      if (value != undefined) {
        this.$element.val(value);

        this.$element.trigger('change');
        return this.$element;
      } else {
        return this.$element.val();
      }
    }

  };

  $.fn.selectpicker = function(option, event) {
    //get the args of the outer function..
    var args = arguments;
    var value;
    var chain = this.each(function() {
      var $this = $(this),
          data = $this.data('selectpicker'),
          options = typeof option == 'object' && option;

      if (!data) {
        $this.data('selectpicker', (data = new Selectpicker(this, options, event)));
      } else {
        for (var i in option) {
          data[i] = option[i];
        }
      }

      if (typeof option == 'string') {
        //Copy the value of option, as once we shift the arguments
        //it also shifts the value of option.
        property = option;
        if (data[property] instanceof Function) {
          [].shift.apply(args);
          value = data[property].apply(data, args);
        } else {
          value = data[property];
        }
      }
    });

    if (value != undefined) {
      return value;
    } else {
      return chain;
    }
  };

  $.fn.selectpicker.defaults = {
    style: null,
    size: 'auto',
    title: null,
    selectedTextFormat: 'values',
    noneSelectedText: 'Nothing selected',
    width: null,
    menuStyle: null,
    toggleSize: null
  };

}(window.jQuery);

/*

  jQuery Tags Input Plugin 1.3.3

  Copyright (c) 2011 XOXCO, Inc

  Documentation for this plugin lives here:
  http://xoxco.com/clickable/jquery-tags-input

  Licensed under the MIT license:
  http://www.opensource.org/licenses/mit-license.php

  ben@xoxco.com

*/

(function($) {

  var delimiter = new Array();
  var tags_callbacks = new Array();
  $.fn.doAutosize = function(o) {
    var minWidth = $(this).data('minwidth'),
        maxWidth = $(this).data('maxwidth'),
        val = '',
        input = $(this),
        testSubject = $('#' + $(this).data('tester_id'));

    if (val === (val = input.val())) {return;}

    // Enter new content into testSubject
    var escaped = val.replace(/&/g, '&amp;').replace(/\s/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    testSubject.html(escaped);
    // Calculate new width + whether to change
    var testerWidth = testSubject.width(),
        newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
        currentWidth = input.width(),
        isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
        || (newWidth > minWidth && newWidth < maxWidth);

    // Animate width
    if (isValidWidthChange) {
      input.width(newWidth);
    }


  };
  $.fn.resetAutosize = function(options) {
    // alert(JSON.stringify(options));
    var minWidth = $(this).data('minwidth') || options.minInputWidth || $(this).width(),
        maxWidth = $(this).data('maxwidth') || options.maxInputWidth || ($(this).closest('.tagsinput').width() - options.inputPadding),
        val = '',
        input = $(this),
        testSubject = $('<tester/>').css({
          position: 'absolute',
          top: -9999,
          left: -9999,
          width: 'auto',
          fontSize: input.css('fontSize'),
          fontFamily: input.css('fontFamily'),
          fontWeight: input.css('fontWeight'),
          letterSpacing: input.css('letterSpacing'),
          whiteSpace: 'nowrap'
        }),
        testerId = $(this).attr('id') + '_autosize_tester';
    if (! $('#' + testerId).length > 0) {
      testSubject.attr('id', testerId);
      testSubject.appendTo('body');
    }

    input.data('minwidth', minWidth);
    input.data('maxwidth', maxWidth);
    input.data('tester_id', testerId);
    input.css('width', minWidth);
  };

  $.fn.addTag = function(value,options) {
    options = jQuery.extend({focus: false, callback: true},options);
    this.each(function() {
      var id = $(this).attr('id');

      var tagslist = $(this).val().split(delimiter[id]);
      if (tagslist[0] == '') {
        tagslist = new Array();
      }

      value = jQuery.trim(value);

      if (options.unique) {
        var skipTag = $(this).tagExist(value);
        if (skipTag == true) {
          //Marks fake input as not_valid to let styling it
          $('#' + id + '_tag').addClass('not_valid');
        }
      } else {
        var skipTag = false;
      }

      if (value != '' && skipTag != true) {
        $('<span>').addClass('tag').append(
            $('<span>').text(value).append('&nbsp;&nbsp;'),
            $('<a class="tagsinput-remove-link">', {
              href: '#',
              title: 'Remove tag',
              text: ''
            }).click(function() {
              return $('#' + id).removeTag(escape(value));
            })
        ).insertBefore('#' + id + '_addTag');

        tagslist.push(value);

        $('#' + id + '_tag').val('');
        if (options.focus) {
          $('#' + id + '_tag').focus();
        } else {
          $('#' + id + '_tag').blur();
        }

        $.fn.tagsInput.updateTagsField(this, tagslist);

        if (options.callback && tags_callbacks[id] && tags_callbacks[id]['onAddTag']) {
          var f = tags_callbacks[id]['onAddTag'];
          f.call(this, value);
        }
        if (tags_callbacks[id] && tags_callbacks[id]['onChange'])
        {
          var i = tagslist.length;
          var f = tags_callbacks[id]['onChange'];
          f.call(this, $(this), tagslist[i - 1]);
        }
      }

    });

    return false;
  };

  $.fn.removeTag = function(value) {
    value = unescape(value);
    this.each(function() {
      var id = $(this).attr('id');

      var old = $(this).val().split(delimiter[id]);

      $('#' + id + '_tagsinput .tag').remove();
      str = '';
      for (i = 0; i < old.length; i++) {
        if (old[i] != value) {
          str = str + delimiter[id] + old[i];
        }
      }

      $.fn.tagsInput.importTags(this, str);

      if (tags_callbacks[id] && tags_callbacks[id]['onRemoveTag']) {
        var f = tags_callbacks[id]['onRemoveTag'];
        f.call(this, value);
      }
    });

    return false;
  };

  $.fn.tagExist = function(val) {
    var id = $(this).attr('id');
    var tagslist = $(this).val().split(delimiter[id]);
    return (jQuery.inArray(val, tagslist) >= 0); //true when tag exists, false when not
  };

  // clear all existing tags and import new ones from a string
  $.fn.importTags = function(str) {
    id = $(this).attr('id');
    $('#' + id + '_tagsinput .tag').remove();
    $.fn.tagsInput.importTags(this, str);
  };

  $.fn.tagsInput = function(options) {
    var settings = jQuery.extend({
      interactive: true,
      defaultText: '',
      minChars: 0,
      width: '',
      height: '',
      autocomplete: {selectFirst: false },
      'hide': true,
      'delimiter': ',',
      'unique': true,
      removeWithBackspace: true,
      placeholderColor: '#666666',
      autosize: true,
      comfortZone: 20,
      inputPadding: 6 * 2
    },options);

    this.each(function() {
      if (settings.hide) {
        $(this).hide();
      }
      var id = $(this).attr('id');
      if (!id || delimiter[$(this).attr('id')]) {
        id = $(this).attr('id', 'tags' + new Date().getTime()).attr('id');
      }

      var data = jQuery.extend({
        pid: id,
        real_input: '#' + id,
        holder: '#' + id + '_tagsinput',
        input_wrapper: '#' + id + '_addTag',
        fake_input: '#' + id + '_tag'
      },settings);

      delimiter[id] = data.delimiter;

      if (settings.onAddTag || settings.onRemoveTag || settings.onChange) {
        tags_callbacks[id] = new Array();
        tags_callbacks[id]['onAddTag'] = settings.onAddTag;
        tags_callbacks[id]['onRemoveTag'] = settings.onRemoveTag;
        tags_callbacks[id]['onChange'] = settings.onChange;
      }

      var containerClass = $('#' + id).attr('class').replace('tagsinput', '');
      var markup = '<div id="' + id + '_tagsinput" class="tagsinput ' + containerClass + '"><div class="tagsinput-add-container" id="' + id + '_addTag"><div class="tagsinput-add"></div>';

      if (settings.interactive) {
        markup = markup + '<input id="' + id + '_tag" value="" data-default="' + settings.defaultText + '" />';
      }

      markup = markup + '</div></div>';

      $(markup).insertAfter(this);

      $(data.holder).css('width', settings.width);
      $(data.holder).css('min-height', settings.height);
      $(data.holder).css('height', '100%');

      if ($(data.real_input).val() != '') {
        $.fn.tagsInput.importTags($(data.real_input), $(data.real_input).val());
      }
      if (settings.interactive) {
        $(data.fake_input).val($(data.fake_input).attr('data-default'));
        $(data.fake_input).css('color', settings.placeholderColor);
        $(data.fake_input).resetAutosize(settings);

        $(data.holder).bind('click', data, function(event) {
          $(event.data.fake_input).focus();
        });

        $(data.fake_input).bind('focus', data, function(event) {
          if ($(event.data.fake_input).val() == $(event.data.fake_input).attr('data-default')) {
            $(event.data.fake_input).val('');
          }
          $(event.data.fake_input).css('color', '#000000');
        });

        if (settings.autocomplete_url != undefined) {
          autocomplete_options = {source: settings.autocomplete_url};
          for (attrname in settings.autocomplete) {
            autocomplete_options[attrname] = settings.autocomplete[attrname];
          }

          if (jQuery.Autocompleter !== undefined) {
            $(data.fake_input).autocomplete(settings.autocomplete_url, settings.autocomplete);
            $(data.fake_input).bind('result', data, function(event,data,formatted) {
              if (data) {
                $('#' + id).addTag(data[0] + '', {focus: true, unique: (settings.unique)});
              }
            });
          } else if (jQuery.ui.autocomplete !== undefined) {
            $(data.fake_input).autocomplete(autocomplete_options);
            $(data.fake_input).bind('autocompleteselect', data, function(event,ui) {
              $(event.data.real_input).addTag(ui.item.value, {focus: true, unique: (settings.unique)});
              return false;
            });
          }


        } else {
          // if a user tabs out of the field, create a new tag
          // this is only available if autocomplete is not used.
          $(data.fake_input).bind('blur', data, function(event) {
            var d = $(this).attr('data-default');
            if ($(event.data.fake_input).val() != '' && $(event.data.fake_input).val() != d) {
              if ((event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)))
                $(event.data.real_input).addTag($(event.data.fake_input).val(), {focus: true, unique: (settings.unique)});
            } else {
              $(event.data.fake_input).val($(event.data.fake_input).attr('data-default'));
              $(event.data.fake_input).css('color', settings.placeholderColor);
            }
            return false;
          });

        }
        // if user types a comma, create a new tag
        $(data.fake_input).bind('keypress', data, function(event) {
          if (event.which == event.data.delimiter.charCodeAt(0) || event.which == 13) {
            event.preventDefault();
            if ((event.data.minChars <= $(event.data.fake_input).val().length) && (!event.data.maxChars || (event.data.maxChars >= $(event.data.fake_input).val().length)))
              $(event.data.real_input).addTag($(event.data.fake_input).val(), {focus: true, unique: (settings.unique)});
            $(event.data.fake_input).resetAutosize(settings);
            return false;
          } else if (event.data.autosize) {
            $(event.data.fake_input).doAutosize(settings);

          }
        });
        //Delete last tag on backspace
        data.removeWithBackspace && $(data.fake_input).bind('keydown', function(event)
                                                            {
                                                              if (event.keyCode == 8 && $(this).val() == '')
                                                              {
                                                                event.preventDefault();
                                                                var last_tag = $(this).closest('.tagsinput').find('.tag:last').text();
                                                                var id = $(this).attr('id').replace(/_tag$/, '');
                                                                last_tag = last_tag.replace(/[\s\u00a0]+x$/, '');
                                                                $('#' + id).removeTag(escape(last_tag));
                                                                $(this).trigger('focus');
                                                              }
                                                            });
        $(data.fake_input).blur();

        //Removes the not_valid class when user changes the value of the fake input
        if (data.unique) {
          $(data.fake_input).keydown(function(event) {
            if (event.keyCode == 8 || String.fromCharCode(event.which).match(/\w+|[áéíóúÁÉÍÓÚñÑ,/]+/)) {
              $(this).removeClass('not_valid');
            }
          });
        }
      } // if settings.interactive
    });

    return this;

  };

  $.fn.tagsInput.updateTagsField = function(obj,tagslist) {
    var id = $(obj).attr('id');
    $(obj).val(tagslist.join(delimiter[id]));
  };

  $.fn.tagsInput.importTags = function(obj,val) {
    $(obj).val('');
    var id = $(obj).attr('id');
    var tags = val.split(delimiter[id]);
    for (i = 0; i < tags.length; i++) {
      $(obj).addTag(tags[i], {focus: false, callback: false});
    }
    if (tags_callbacks[id] && tags_callbacks[id]['onChange'])
    {
      var f = tags_callbacks[id]['onChange'];
      f.call(obj, obj, tags[i]);
    }
  };

})(jQuery);

/* ============================================================
 * bootstrapSwitch v1.3 by Larentis Mattia @spiritualGuru
 * http://www.larentis.eu/switch/
 * ============================================================
 * Licensed under the Apache License, Version 2.0
 * http://www.apache.org/licenses/LICENSE-2.0
 * ============================================================ */

!function($) {
  'use strict';

  $.fn['bootstrapSwitch'] = function(method) {
    var methods = {
      init: function() {
        return this.each(function() {
          var $element = $(this)
          , $div
, $switchLeft
, $switchRight
, $label
, myClasses = ''
          , classes = $element.attr('class')
          , color
, moving
, onLabel = 'ON'
          , offLabel = 'OFF'
          , icon = false;

          $.each(['switch-mini', 'switch-small', 'switch-large'], function(i, el) {
            if (classes.indexOf(el) >= 0)
              myClasses = el;
          });

          $element.addClass('has-switch');

          if ($element.data('on') !== undefined)
            color = 'switch-' + $element.data('on');

          if ($element.data('on-label') !== undefined)
            onLabel = $element.data('on-label');

          if ($element.data('off-label') !== undefined)
            offLabel = $element.data('off-label');

          if ($element.data('icon') !== undefined)
            icon = $element.data('icon');

          $switchLeft = $('<span>')
            .addClass('switch-left')
            .addClass(myClasses)
            .addClass(color)
            .html(onLabel);

          color = '';
          if ($element.data('off') !== undefined)
            color = 'switch-' + $element.data('off');

          $switchRight = $('<span>')
            .addClass('switch-right')
            .addClass(myClasses)
            .addClass(color)
            .html(offLabel);

          $label = $('<label>')
            .html('&nbsp;')
            .addClass(myClasses)
            .attr('for', $element.find('input').attr('id'));

          if (icon) {
            $label.html('<i class="' + icon + '"></i>');
          }

          $div = $element.find(':checkbox').wrap($('<div>')).parent().data('animated', false);

          if ($element.data('animated') !== false)
            $div.addClass('switch-animate').data('animated', true);

          $div
            .append($switchLeft)
            .append($label)
            .append($switchRight);

          $element.find('>div').addClass(
              $element.find('input').is(':checked') ? 'switch-on' : 'switch-off'
          );

          if ($element.find('input').is(':disabled'))
            $(this).addClass('deactivate');

          var changeStatus = function($this) {
            $this.siblings('label').trigger('mousedown').trigger('mouseup').trigger('click');
          };

          $element.on('keydown', function(e) {
            if (e.keyCode === 32) {
              e.stopImmediatePropagation();
              e.preventDefault();
              changeStatus($(e.target).find('span:first'));
            }
          });

          $switchLeft.on('click', function(e) {
            changeStatus($(this));
          });

          $switchRight.on('click', function(e) {
            changeStatus($(this));
          });

          $element.find('input').on('change', function(e) {
            var $this = $(this)
            , $element = $this.parent()
            , thisState = $this.is(':checked')
            , state = $element.is('.switch-off');

            e.preventDefault();

            $element.css('left', '');

            if (state === thisState) {

              if (thisState)
                $element.removeClass('switch-off').addClass('switch-on');
              else $element.removeClass('switch-on').addClass('switch-off');

              if ($element.data('animated') !== false)
                $element.addClass('switch-animate');

              $element.parent().trigger('switch-change', {'el': $this, 'value': thisState});
            }
          });

          $element.find('label').on('mousedown touchstart', function(e) {
            var $this = $(this);
            moving = false;

            e.preventDefault();
            e.stopImmediatePropagation();

            $this.closest('div').removeClass('switch-animate');

            if ($this.closest('.has-switch').is('.deactivate'))
              $this.unbind('click');
            else {
              $this.on('mousemove touchmove', function(e) {
                var $element = $(this).closest('.switch')
                , relativeX = (e.pageX || e.originalEvent.targetTouches[0].pageX) - $element.offset().left
, percent = (relativeX / $element.width()) * 100
                , left = 25
                , right = 75;

                moving = true;

                if (percent < left)
                  percent = left;
                else if (percent > right)
                  percent = right;

                $element.find('>div').css('left', (percent - right) + '%');
              });

              $this.on('click touchend', function(e) {
                var $this = $(this)
                , $target = $(e.target)
                , $myCheckBox = $target.siblings('input');

                e.stopImmediatePropagation();
                e.preventDefault();

                $this.unbind('mouseleave');

                if (moving)
                  $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25));
                else $myCheckBox.prop('checked', !$myCheckBox.is(':checked'));

                moving = false;
                $myCheckBox.trigger('change');
              });

              $this.on('mouseleave', function(e) {
                var $this = $(this)
                , $myCheckBox = $this.siblings('input');

                e.preventDefault();
                e.stopImmediatePropagation();

                $this.unbind('mouseleave');
                $this.trigger('mouseup');

                $myCheckBox.prop('checked', !(parseInt($this.parent().css('left')) < -25)).trigger('change');
              });

              $this.on('mouseup', function(e) {
                e.stopImmediatePropagation();
                e.preventDefault();

                $(this).unbind('mousemove');
              });
            }
          });
        }
        );
      },
      toggleActivation: function() {
        $(this).toggleClass('deactivate');
      },
      isActive: function() {
        return !$(this).hasClass('deactivate');
      },
      setActive: function(active) {
        if (active)
          $(this).removeClass('deactivate');
        else $(this).addClass('deactivate');
      },
      toggleState: function(skipOnChange) {
        var $input = $(this).find('input:checkbox');
        $input.prop('checked', !$input.is(':checked')).trigger('change', skipOnChange);
      },
      setState: function(value, skipOnChange) {
        $(this).find('input:checkbox').prop('checked', value).trigger('change', skipOnChange);
      },
      status: function() {
        return $(this).find('input:checkbox').is(':checked');
      },
      destroy: function() {
        var $div = $(this).find('div')
        , $checkbox;

        $div.find(':not(input:checkbox)').remove();

        $checkbox = $div.children();
        $checkbox.unwrap().unwrap();

        $checkbox.unbind('change');

        return $checkbox;
      }
    };

    if (methods[method])
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || !method)
      return methods.init.apply(this, arguments);
    else
      $.error('Method ' + method + ' does not exist!');
  };
}(jQuery);

$(function() {
  $('.switch')['bootstrapSwitch']();
});

/* =============================================================
 * flatui-checkbox.js v0.0.2
 * ============================================================ */

!function($) {

  /* CHECKBOX PUBLIC CLASS DEFINITION
   * ============================== */

  var Checkbox = function(element, options) {
    this.init(element, options);
  };

  Checkbox.prototype = {

    constructor: Checkbox

, init: function(element, options) {
      var $el = this.$element = $(element);

      this.options = $.extend({}, $.fn.checkbox.defaults, options);
      $el.before(this.options.template);
      this.setState();
    }

    , setState: function() {
      var $el = this.$element
, $parent = $el.closest('.checkbox');

      $el.prop('disabled') && $parent.addClass('disabled');
      $el.prop('checked') && $parent.addClass('checked');
    }

    , toggle: function() {
      var ch = 'checked'
      , $el = this.$element
, $parent = $el.closest('.checkbox')
      , checked = $el.prop(ch)
      , e = $.Event('toggle');

      if ($el.prop('disabled') == false) {
        $parent.toggleClass(ch) && checked ? $el.removeAttr(ch) : $el.attr(ch, true);
        $el.trigger(e).trigger('change');
      }
    }

    , setCheck: function(option) {
      var d = 'disabled'
      , ch = 'checked'
      , $el = this.$element
, $parent = $el.closest('.checkbox')
      , checkAction = option == 'check' ? true : false
, e = $.Event(option);

      $parent[checkAction ? 'addClass' : 'removeClass'](ch) && checkAction ? $el.attr(ch, true) : $el.removeAttr(ch);
      $el.trigger(e).trigger('change');
    }

  };


  /* CHECKBOX PLUGIN DEFINITION
   * ======================== */

  var old = $.fn.checkbox;

  $.fn.checkbox = function(option) {
    return this.each(function() {
      var $this = $(this)
      , data = $this.data('checkbox')
      , options = $.extend({}, $.fn.checkbox.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('checkbox', (data = new Checkbox(this, options)));
      if (option == 'toggle') data.toggle();
      if (option == 'check' || option == 'uncheck') data.setCheck(option);
      else if (option) data.setState();
    });
  };

  $.fn.checkbox.defaults = {
    template: '<span class="icons"><span class="first-icon fui-checkbox-unchecked"></span><span class="second-icon fui-checkbox-checked"></span></span>'
  };


  /* CHECKBOX NO CONFLICT
   * ================== */

  $.fn.checkbox.noConflict = function() {
    $.fn.checkbox = old;
    return this;
  };


  /* CHECKBOX DATA-API
   * =============== */

  $(document).on('click.checkbox.data-api', '[data-toggle^=checkbox], .checkbox', function(e) {
    var $checkbox = $(e.target);
    e && e.preventDefault() && e.stopPropagation();
    if (!$checkbox.hasClass('checkbox')) $checkbox = $checkbox.closest('.checkbox');
    $checkbox.find(':checkbox').checkbox('toggle');
  });

  $(window).on('load', function() {
    $('[data-toggle="checkbox"]').each(function() {
      var $checkbox = $(this);
      $checkbox.checkbox();
    });
  });

}(window.jQuery);



/* =============================================================
 * flatui-radio.js v0.0.2
 * ============================================================ */

!function($) {

  /* RADIO PUBLIC CLASS DEFINITION
   * ============================== */

  var Radio = function(element, options) {
    this.init(element, options);
  };

  Radio.prototype = {

    constructor: Radio

, init: function(element, options) {
      var $el = this.$element = $(element);

      this.options = $.extend({}, $.fn.radio.defaults, options);
      $el.before(this.options.template);
      this.setState();
    }

    , setState: function() {
      var $el = this.$element
, $parent = $el.closest('.radio');

      $el.prop('disabled') && $parent.addClass('disabled');
      $el.prop('checked') && $parent.addClass('checked');
    }

    , toggle: function() {
      var d = 'disabled'
      , ch = 'checked'
      , $el = this.$element
, checked = $el.prop(ch)
      , $parent = $el.closest('.radio')
      , $parentWrap = $el.closest('form').length ? $el.closest('form') : $el.closest('body')
      , $elemGroup = $parentWrap.find(':radio[name="' + $el.attr('name') + '"]')
      , e = $.Event('toggle');

      $elemGroup.not($el).each(function() {
        var $el = $(this)
        , $parent = $(this).closest('.radio');

        if ($el.prop(d) == false) {
          $parent.removeClass(ch) && $el.attr(ch, false).trigger('change');
        }
      });

      if ($el.prop(d) == false) {
        if (checked == false) $parent.addClass(ch) && $el.attr(ch, true);
        $el.trigger(e);

        if (checked !== $el.prop(ch)) {
          $el.trigger('change');
        }
      }
    }

    , setCheck: function(option) {
      var ch = 'checked'
      , $el = this.$element
, $parent = $el.closest('.radio')
      , checkAction = option == 'check' ? true : false
, checked = $el.prop(ch)
      , $parentWrap = $el.closest('form').length ? $el.closest('form') : $el.closest('body')
      , $elemGroup = $parentWrap.find(':radio[name="' + $el['attr']('name') + '"]')
      , e = $.Event(option);

      $elemGroup.not($el).each(function() {
        var $el = $(this)
        , $parent = $(this).closest('.radio');

        $parent.removeClass(ch) && $el.removeAttr(ch);
      });

      $parent[checkAction ? 'addClass' : 'removeClass'](ch) && checkAction ? $el.attr(ch, true) : $el.removeAttr(ch);
      $el.trigger(e);

      if (checked !== $el.prop(ch)) {
        $el.trigger('change');
      }
    }

  };


  /* RADIO PLUGIN DEFINITION
   * ======================== */

  var old = $.fn.radio;

  $.fn.radio = function(option) {
    return this.each(function() {
      var $this = $(this)
      , data = $this.data('radio')
      , options = $.extend({}, $.fn.radio.defaults, $this.data(), typeof option == 'object' && option);
      if (!data) $this.data('radio', (data = new Radio(this, options)));
      if (option == 'toggle') data.toggle();
      if (option == 'check' || option == 'uncheck') data.setCheck(option);
      else if (option) data.setState();
    });
  };

  $.fn.radio.defaults = {
    template: '<span class="icons"><span class="first-icon fui-radio-unchecked"></span><span class="second-icon fui-radio-checked"></span></span>'
  };


  /* RADIO NO CONFLICT
   * ================== */

  $.fn.radio.noConflict = function() {
    $.fn.radio = old;
    return this;
  };


  /* RADIO DATA-API
   * =============== */

  $(document).on('click.radio.data-api', '[data-toggle^=radio], .radio', function(e) {
    var $radio = $(e.target);
    e && e.preventDefault() && e.stopPropagation();
    if (!$radio.hasClass('radio')) $radio = $radio.closest('.radio');
    $radio.find(':radio').radio('toggle');
  });

  $(window).on('load', function() {
    $('[data-toggle="radio"]').each(function() {
      var $radio = $(this);
      $radio.radio();
    });
  });

}(window.jQuery);


/* =============================================================
 * Some general UI pack related JS
 * ============================================================ */

// Extend JS String with repeat method
String.prototype.repeat = function(num) {
  return new Array(num + 1).join(this);
};

(function($) {

  // Add segments to a slider
  $.fn.addSliderSegments = function(amount) {
    return this.each(function() {
      var segmentGap = 100 / (amount - 1) + '%'
      , segment = "<div class='ui-slider-segment' style='margin-left: " + segmentGap + ";'></div>";
      $(this).prepend(segment.repeat(amount - 2));
    });
  };
})(jQuery);
