/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    /**
     * @class CUI.rte.Theme
     * The theme-specific constants for the RTE component.
     * @static
     * @singleton
     * @ignore
     */
    CUI.rte.Theme = function() {

        return {

            /**
             * The default height of a rich text editor component, including the toolbar(s)
             * (defaults to 210)
             * @static
             * @final
             * @type Number
             * @ignore
             */
            DEFAULT_HEIGHT: 210,

            /**
             * The default path where the required stylesheets are located (defaults to
             * "/libs/cq/widgets/themes/default/widgets/form/RichText" [5.2] resp.
             * "/libs/cq/ui/widgets/themes/default/widgets/form/RichText" [as of 5.3])
             * @static
             * @final
             * @type String
             * @ignore
             */
            DEFAULT_REQCSS_PATH: "/libs/cq/ui/rte/themes/default/internal",

            /**
             * CSS class to be used for styling an anchor (defauls to "cui-rte-anchor")
             * @static
             * @final
             * @type String
             * @ignore
             */
            ANCHOR_CLASS: "cui-rte-anchor",

            /**
             * CSS class to be used for styling a table with no actual border (defaults to
             * "cui-rte-forcedborder")
             * @static
             * @final
             * @type String
             * @ignore
             */
            TABLE_NOBORDER_CLASS: "cui-rte-forcedborder",

            /**
             * CSS class to be used for custom selections within a table (defaults to
             * "cui-rte-tableselection")
             * @static
             * @final
             * @type String
             * @since 5.3
             * @ignore
             */
            TABLESELECTION_CLASS: "cui-rte-tableselection",

            /**
             * CSS class that is added to active toolbar items
             */
            TOOLBAR_ACTIVE: "active",

            /**
             * CSS class that is added to disabled toolbar items
             * @ignore
             */
            TOOLBARITEM_DISABLED_CLASS: "disabled",

            /**
             * CSS class that is added to selected toolbar items
             * @ignore
             */
            TOOLBARITEM_SELECTED_CLASS: "selected",

            /**
             * Prefix for icon classes
             */
            TOOLBARITEM_ICON_PREFIX: "icon-",

            /**
             * Blank image path
             */
            BLANK_IMAGE: "../images/components/rte/blank.png"

        };

    }();

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.UIUtils = function() {

        return {

            addStyleSheet: function(cssToAdd, doc) {
                doc = doc || document;
                if (!CUI.rte.Utils.isArray(cssToAdd)) {
                    cssToAdd = [ cssToAdd ];
                }
                var headEl = doc.getElementsByTagName("head")[0];
                var styleSheet = doc.createElement("style");
                styleSheet.type = 'text/css';
                headEl.appendChild(styleSheet);
                var cssText = "";
                var cssCnt = cssToAdd.length;
                for (var c = 0; c < cssCnt; c++) {
                    var css = cssToAdd[c];
                    cssText += css[".name"] + " {\n";
                    for (var key in css) {
                        if (css.hasOwnProperty(key) && (key !== ".name")) {
                            cssText += "    " + key + ": " + css[key] + ";\n";
                        }
                    }
                    cssText += "}\n\n";
                }
                styleSheet.innerHTML = cssText;
                return styleSheet;
            },

            removeStyleSheet: function(styleSheet) {
                styleSheet.parentNode.removeChild(styleSheet);
            },

            getUIContainer: function($editable) {
                var $ui = $editable.data("rte-ui");
                if ($ui) {
                    return $ui;
                }
                var editableDom = $editable[0].previousSibling;
                while (editableDom && (editableDom.nodeType !== 1)) {
                    editableDom = editableDom.previousSibling;
                }
                if (!editableDom || !CUI.rte.Common.hasCSS(editableDom, "rte-ui")) {
                    return null;
                }
                return $(editableDom);
            },

            createOrGetUIContainer: function($editable) {
                var $container = CUI.rte.UIUtils.getUIContainer($editable);
                if (!$container) {
                    $container = $("<div class='rte-ui'></div>");
                    $editable.before($container);
                }
                return $container;
            },

            getToolbar: function($editableOrContainer, tbType) {
                tbType = tbType || "inline";
                var $container = $editableOrContainer.hasClass("rte-ui") ?
                        $editableOrContainer :
                        CUI.rte.UIUtils.getUIContainer($editableOrContainer);
                if (!$container || !$container.length) {
                    return null;
                }
                var $toolbar = $container.find(
                        "div[data-type=\"" + tbType + "\"] > div.rte-toolbar");
                if (!$toolbar || !$toolbar.length) {
                    return null;
                }
                return $toolbar;
            },

            getPopover: function(ref, tbType, $container) {
                tbType = tbType || "inline";
                return $container.find("div[data-type=\"" + tbType + "\"] > " +
                        "div[data-id=\"" + ref + "\"]");
            },

            getPopoverTrigger: function(ref, tbType, $containerOrToolbar) {
                tbType = tbType || "inline";
                var $toolbar = ($containerOrToolbar.hasClass("rte-toolbar") ?
                        $containerOrToolbar :
                        CUI.rte.UIUtils.getToolbar($containerOrToolbar, tbType));
                return $toolbar.find("button[data-action=\"" + ref + "\"]")
            },

            getElement: function(ref, tbType, $container) {
                tbType = tbType || "inline";
                return $container.find("div[data-type=\"" + tbType + "\"] " +
                        "button[data-action=\"" + ref + "\"]");
            },

            getDialog: function(ref, tbType, $container) {
                tbType = tbType || "inline";
                var $dialog = $container.find("div[data-type=\"" + tbType + "\"] > " +
                        "div[data-rte-dialog=\"" + ref + "\"]");
                if (($dialog.length === 0) && (tbType !== "global")) {
                    $dialog = $container.find("div[data-type=\"global\"] > " +
                        "div[data-rte-dialog=\"" + ref + "\"]");
                }
                return $dialog;
            },

            /**
             * Returns the specified UI "space". Creates it, if it is not yet available.
             * @param {String} mode The mode the UI space is used for
             * @param $container The UI container
             * @return {jQuery} The UI space
             */
            getSpace: function(mode, $container) {
                var $uiSpace = $container.find("> div[data-type=\"" + mode + "\"]");
                if (!$uiSpace.length) {
                    $uiSpace = $(CUI.rte.Templates["ui-space"]({
                        "mode": mode
                    }));
                    $container.append($uiSpace);
                }
                return $uiSpace;
            },

            determineIconClass: function(element) {
                var com = CUI.rte.Common;
                var classes = com.parseCSS(element.jquery ? element[0] : element);
                for (var c = 0; c < classes.length; c++) {
                    if (com.strStartsWith(classes[c],
                            CUI.rte.Theme.TOOLBARITEM_ICON_PREFIX)) {
                        return classes[c];
                    }
                }
                return undefined;
            },

            killEvent: function(e) {
                e.stopPropagation();
                e.preventDefault();
            },

            /**
             * <p>Determines the "clipping parent" of the specified DOM object.</p>
             * <p>The clipping parent is a DOM object that might clip the visible area of
             * the specified DOM object by specifiying a suitable "overflow" attribute.</p>
             * @param {jQuery} $dom The jQuery-wrapped DOM object
             * @return {jQuery} The clipping parent as a jQuery object; undefined if no
             *         clipping parent exists
             */
            getClippingParent: function($dom) {
                var $clipParent = undefined;
                var $body = $(document.body);
                while ($dom[0] !== $body[0]) {
                    var ovf = $dom.css("overflow");
                    var ovfX = $dom.css("overflowX");
                    var ovfY = $dom.css("overflowY");
                    if ((ovfX !== "visible") || (ovfY !== "visible") || (ovf !== "visible")) {
                        $clipParent = $dom;
                        break;
                    }
                    $dom = $dom.parent();
                }
                return $clipParent;
            },

            getEditorOffsets: function(context) {
                var top = 0;
                var left = 0;
                var editorDoc = context.doc;
                while (editorDoc !== document) {
                    var win = CUI.rte.Common.getWindowForDocument(editorDoc);
                    if (win.frameElement) {
                        var offsets = $(win.frameElement).offset();
                        top += offsets.top;
                        left += offsets.left;
                    } else {
                        break;
                    }
                    editorDoc = win.frameElement.ownerDocument;
                }
                return {
                    "top": top,
                    "left": left
                };
            },

            isUnder: function($parent, $obj) {
                if (!$parent || ($parent.length === 0)) {
                    return false;
                }
                if (!$obj || ($obj.length === 0)) {
                    return false;
                }
                var obj = $parent[0];
                var toTest = $obj[0];
                while (toTest.tagName !== "BODY") {
                    if (toTest === obj) {
                        return true;
                    }
                    toTest = toTest.parentNode;
                }
                return false;
            }

        }

    }();

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ConfigUtils = function() {

        function getPluginDef(action) {
            if (action) {
                var sepPos = action.indexOf("#");
                if (sepPos > 0) {
                    var plugin = action.substring(0, sepPos);
                    var feature = action.substring(sepPos + 1);
                    return {
                        "plugin": plugin,
                        "feature": feature
                    };
                }
            }
            return null;
        }

        return {

            createFeaturesFromToolbar: function($container, $toolbar) {
                var featureDefs = [ ];
                // first, analyze the toolbar
                var $buttons = $toolbar.find("button.item");
                $buttons.each(function() {
                    var pluginDef = getPluginDef($(this).data("action"));
                    if (pluginDef) {
                        featureDefs.push(pluginDef);
                    }
                });
                // then, analyze popovers
                var $popovers = $container.find("div.rte-popover button.item");
                $popovers.each(function() {
                    var pluginDef = getPluginDef($(this).data("action"));
                    if (pluginDef) {
                        featureDefs.push(pluginDef);
                    }
                });
                return featureDefs;
            },

            mergeConfigAndFeatures: function(config, features) {
                if (!features || (features.length === 0)) {
                    return config;
                }
                var pluginConfig;
                if (config.hasOwnProperty("rtePlugins")) {
                    pluginConfig = config["rtePlugins"];
                } else {
                    pluginConfig = { };
                    config["rtePlugins"] = pluginConfig;
                }
                var featureCnt = features.length;
                for (var f = 0; f < featureCnt; f++) {
                    var feature = features[f];
                    var pluginId = feature.plugin;
                    var featureId = feature.feature;
                    var cfg, plgFeature;
                    if (!pluginConfig.hasOwnProperty(pluginId)) {
                        cfg = { };
                        pluginConfig[pluginId] = cfg;
                    } else {
                        cfg = pluginConfig[pluginId];
                    }
                    if (cfg.hasOwnProperty("features")) {
                        plgFeature = cfg["features"];
                        if (CUI.rte.Utils.isArray(plgFeature)) {
                            plgFeature.push(featureId)
                        } else {
                            if (plgFeature !== "*") {
                                plgFeature = [ featureId ];
                                cfg["features"] = plgFeature;
                            }
                        }
                    } else {
                        plgFeature = [ featureId ];
                        cfg["features"] = plgFeature;
                    }
                }
                return config;
            },

            loadConfigAndStartEditing: function(rte, $editable) {
                var features;
                var $container = CUI.rte.UIUtils.getUIContainer($editable);
                var $toolbar = CUI.rte.UIUtils.getToolbar($editable);

                function processConfig(config) {
                    config = CUI.rte.ConfigUtils.mergeConfigAndFeatures(config, features);
                    rte.start(config);
                }

                if ($toolbar && ($toolbar.length > 0)) {
                    features = CUI.rte.ConfigUtils.createFeaturesFromToolbar($container,
                            $toolbar);
                }
                var config = { };
                var configStr = $editable.data("config");
                if (configStr) {
                    try {
                        config = $.parseJSON(configStr);
                    } catch (e) {
                        // use default config
                    }
                    processConfig(config);
                } else {
                    var configPath = $editable.data("config-path");
                    if (configPath) {
                        $.ajax({
                            "url": configPath,
                            "success": function(data) {
                                processConfig(data);
                            },
                            "error": function() {
                                processConfig({ });
                            }
                        });
                    } else {
                        processConfig(config);
                    }
                }

            }

        };

    }();

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

/**
 * @class CUI.rte.plugins.ControlPlugin
 * @extends CUI.rte.plugins.Plugin
 * <p>This class implements some control functionality as a plugin.</p>
 * <p>The plugin ID is "<b>control</b>".</p>
 * <p><b>Features</b></p>
 * <ul>
 *   <li><b>close</b> - adds a button that dispatches a "close" request</li>
 * </ul>
 */
CUI.rte.plugins.ControlPlugin = new Class({

    toString: "ControlPlugin",

    extend: CUI.rte.plugins.Plugin,


    getFeatures: function() {
        return [ "close" ];
    },

    initializeUI: function(tbGenerator) {
        var plg = CUI.rte.plugins;
        var ui = CUI.rte.ui;
        if (this.isFeatureEnabled("close")) {
            this.closeUI = tbGenerator.createElement("close", this, false,
                    this.getTooltip("close"));
            tbGenerator.addElement("control", plg.Plugin.SORT_MAX -1, this.closeUI, 10);
        }
    },

    notifyPluginConfig: function(pluginConfig) {
        pluginConfig = pluginConfig || { };
        CUI.rte.Utils.applyDefaults(pluginConfig, {
            "features": "*",
            "tooltips": {
                "close": {
                    "title": CUI.rte.Utils.i18n("Close"),
                    "text": CUI.rte.Utils.i18n("Finish editing the text.")
                }
            }
        });
        this.config = pluginConfig;
    },

    execute: function(cmd, value, env) {
        if (cmd == "close") {
            this.editorKernel.fireUIEvent("requestClose");
        }
    },

    updateState: function(selDef) {
        // nothing to do
    }

});


// register plugin
CUI.rte.plugins.PluginRegistry.register("control", CUI.rte.plugins.ControlPlugin);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {


    CUI.rte.ui.cui.ToolkitImpl = new Class({

        toString: "ToolkitImpl",

        extend: CUI.rte.ui.Toolkit,

        dropDownCls: null,

        menuCls: null,

        initialize: function(cb) {
            // currently not required
        },

        requiresInit: function() {
            return false;
        },

        createToolbarBuilder: function(hint) {
            return new CUI.rte.ui.cui.CuiToolbarBuilder();
        },

        createContextMenuBuilder: function(editorKernel) {
            return new CUI.rte.ui.cui.CuiContextMenuBuilder(editorKernel);
        },

        createDialogManager: function(editorKernel) {
            return new CUI.rte.ui.cui.CuiDialogManager(editorKernel)
        }

    });

    CUI.rte.ui.ToolkitRegistry.register("cui", CUI.rte.ui.cui.ToolkitImpl);

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.ToolbarImpl = new Class({

        toString: "ToolbarImpl",

        /**
         * @type CUI.rte.EditorKernel
         */
        editorKernel: null,

        extend: CUI.rte.ui.Toolbar,

        elementMap: null,

        $container: null,

        $editable: null,

        $toolbar: null,

        $clipParent: null,

        /**
         * @type CUI.rte.ui.cui.PopoverManager
         */
        popover: null,

        preferredToolbarPos: null,

        _popoverStyleSheet: null,

        _tbHideTimeout: null,

        _recordedScrollTop: null,

        _offsets: null,

        _isClipped: false,

        NO_OFFSETS: {
            "top": 0,
            "left": 0
        },

        construct: function(elementMap, $editable, tbType) {
            this.elementMap = elementMap;
            this.$editable = $editable;
            this.tbType = (tbType || "inline");
            this.$container = CUI.rte.UIUtils.getUIContainer(this.$editable);
            this.$toolbar = CUI.rte.UIUtils.getToolbar(this.$editable, tbType);
            this.popover = new CUI.rte.ui.cui.PopoverManager(this.$container, tbType);
        },

        _getClipOffsets: function() {
            var context = this.editorKernel.getEditContext();
            if (context.doc !== document) {
                if (this._isClipped) {
                    return {
                        "top": this.$clipParent.scrollTop(),
                        "left": this.$clipParent.scrollLeft()
                    };
                }
                return this.NO_OFFSETS;
            }
            return (this._isClipped ? this.$clipParent.offset() : this.NO_OFFSETS);
        },

        /**
         * Calculates the internal offsets for the toolbar. Those are required to correctly
         * position a toolbar that is contained in another document than the edited div.
         * @private
         * @return {{top:Number,left:Number}} The offsets
         */
        _calcInternalOffsets: function() {
            this._isClipped = CUI.rte.UIUtils.isUnder(this.$clipParent, this.$container);
            if (this._isClipped) {
                return this.$clipParent.offset();
            }
            return this.NO_OFFSETS;
        },

        /**
         * Calculates the optimal toolbart position, which is directly above the editable div.
         * The position might not be valid; this has to be considered separately.
         * @private
         */
        _calcOptimum: function(popoverData) {
            var editablePos = this.$editable.offset();
            var offsetTop = 0;
            var offsetLeft = 0;
            if (this._isClipped) {
                var offset = this._getClipOffsets();
                offsetTop = offset.top;
                offsetLeft = offset.left;
            }
            var tbHeight = this.$toolbar.outerHeight();
            return {
                "left": editablePos.left - offsetLeft,
                "top": editablePos.top - tbHeight - offsetTop
            };
        },

        /**
         * <p>Calculates the vertical coordinates of the "forbidden area" where the toolbar
         * should not be positioned if possible.</p>
         * <p>This is usually the vertical screen estate the current selection takes. On
         * touch devices, approximal values for native elements (the notorious "callout"
         * ...) are added.</p>
         * @param {Object} selection The current processing selection
         * @return {{start: Number, end: Number}} The vertical screen estate reserved for
         *         selection + native stuff; undefined for invalid selections
         * @private
         */
        _calcForbidden: function(selection) {
            var dpr = CUI.rte.DomProcessor;
            var sel = CUI.rte.Selection;
            var com = CUI.rte.Common;
            var forbidden = undefined;
            var context = this.editorKernel.getEditContext();
            selection = selection || this.editorKernel.createQualifiedSelection(context);
            if (selection && selection.startNode && this.editorKernel.hasFocus) {
                var startNode = selection.startNode;
                var startOffset = selection.startOffset;
                var endNode = selection.endNode;
                var endOffset = selection.endOffset;
                var isSel = sel.isSelection(selection);
                var area = dpr.calcScreenEstate(context, startNode, startOffset, endNode,
                        endOffset);
                var yStart = area.startY - (isSel ? com.ua.calloutHeight : 0);
                var yEnd = area.endY;
                if (this._isClipped) {
                    var offs = this._getClipOffsets();
                    yStart -= offs.top;
                    yEnd -= offs.top;
                }
                forbidden = {
                    "start": yStart - (isSel ? com.ua.selectionHandlesHeight : 0),
                    "end": yEnd + (isSel ? com.ua.selectionHandlesHeight : 0)
                };
            }
            return forbidden;
        },

        /**
         * Calculates the vertical screen estate that is actually available (approximately).
         * @param {jQuery} $win The window object, wrapped in a jQuery object
         * @return {{min: Number, max: Number}} The minimum/maximum vertical coordinates that
         *         are available
         * @private
         */
        _calcAvail: function($win) {
            var com = CUI.rte.Common;
            var screenKeyboardHeight = (com.isPortrait() ? com.ua.screenKeyHeightPortrait
                    : com.ua.screenKeyHeightLandscape);
            var availHeight = $win.height() - screenKeyboardHeight;
            // the scroll offsets of the clipping parent are handled by jQuery
            // automatically, so we don't have to take care of it here
            if (this._isClipped) {
                var context = this.editorKernel.getEditContext();
                if (context.doc !== document) {
                    var offsets = this.$clipParent.offset();
                    availHeight -= offsets.top;
                }
            }
            // special case: on touch, we need to consider the main window's scroll offset
            // as well
            // TODO check if required on desktop as well (when used outside a clipParent)
            var min = 0;
            if (com.ua.isTouch) {
                min = $win.scrollTop();
            }
            return {
                "min": min,
                "max": min + availHeight
            }
        },

        /**
         * Calculates the vertical coordinates of the UI (toolbar + popover/if applicable).
         * @param {Number} tbTop The toolbar's top coordinate
         * @param {Number} tbHeight The toolbar's height
         * @param {Number} popoverHeight The popover's height; 0 if no popover is shown
         * @param {String} popoverAlign The popover's alignment ("top" or "bottom")
         * @return {{y1: Number, y2: Number}} The top and bottom coordinates of the UI
         * @private
         */
        _calcUITotal: function(tbTop, tbHeight, popoverHeight, popoverAlign) {
            var y1 = tbTop;
            var y2 = tbTop + tbHeight;
            if (popoverAlign === "top") {
                y1 -= popoverHeight;
            } else {
                y2 += popoverHeight;
            }
            return {
                "y1": y1,
                "y2": y2
            };
        },

        _calcUIPosition: function($win, selection) {
            var popoverData = this.popover.calc();
            var optimum = this._calcOptimum(popoverData);
            if (!this.preferredToolbarPos) {
                this.preferredToolbarPos = optimum;
            }
            var tbHeight = this.$toolbar.outerHeight();
            var totalHeight = tbHeight + popoverData.height;
            var tbLeft = this.preferredToolbarPos.left;
            var tbTop = this.preferredToolbarPos.top;
            var popoverAlign = "top";
            var avail = this._calcAvail($win || $(window));
            // see if the toolbar still fits into the screen
            if (tbTop < avail.min) {
                tbTop = avail.min;
            } else if ((tbTop + tbHeight) > avail.max) {
                tbTop = avail.max - totalHeight;
                popoverAlign = "bottom";
            } else {
                // if we can keep the toolbar at the same position by changing the alignment
                // of the popover, we try it
                if ((tbTop - popoverData.height) < avail.min) {
                    popoverAlign = "bottom";
                }
            }
            // check if we need to move the toolbar due to current selection state and
            // what has probably been added to screen by the browser (for example, the
            // callout and the screen keyboard on an iPad)
            var forbidden = this._calcForbidden(selection);
            if (forbidden) {
                var totalPos = this._calcUITotal(tbTop, tbHeight, popoverData.height,
                        popoverAlign);
                // console.log("a, f, t, o: ", avail, forbidden, totalPos, optimum);
                if ((totalPos.y2 > forbidden.start) && (totalPos.y1 < forbidden.end)) {
                    // The toolbar is in the "forbidden area", overlapping either the
                    // current selection and/or the callout (iPad). In such cases, we first
                    // check if we can place it above the forbidden area if we allow moving
                    // the toolbar, starting with an optimal position ...
                    if (((optimum.top - popoverData.height) > avail.min) &&
                            ((optimum.top + tbHeight) < forbidden.start)) {
                        popoverAlign = "top";
                        tbTop = optimum.top;
                    } else if ((forbidden.start - totalHeight) > avail.min) {
                        // ..., otherwise see if it fits above somewhere else than at the
                        // optimal position, ...
                        popoverAlign = "top";
                        tbTop = forbidden.start - tbHeight;
                    } else if ((forbidden.end + totalHeight) <= avail.max) {
                        // ..., otherwise we try to move the toolbar under the selection
                        popoverAlign = "bottom";
                        tbTop = forbidden.end;
                    } else {
                        // if that is not possible, we move it as far to the bottom as
                        // possible, which will hide part of the selection, but should avoid
                        // conflicting with the (potential) callout completely
                        popoverAlign = "bottom";
                        tbTop = avail.max - totalHeight;
                    }
                }
            }
            // calculate popover position
            var popoverTop = (popoverAlign === "top" ?
                    tbTop - popoverData.height :
                    tbTop + tbHeight + popoverData.arrowHeight);
            this.preferredToolbarPos = {
                "left": tbLeft,
                "top": tbTop
            };
            return {
                "toolbar": {
                    "left": tbLeft + this._offsets.left,
                    "top": tbTop + this._offsets.top
                },
                "popover": {
                    "left": tbLeft + this._offsets.left,
                    "top": popoverTop + this._offsets.top,
                    "align": popoverAlign,
                    "arrow": (popoverAlign === "top" ? "bottom" : "top")
                }
            };
        },

        _updateUI: function() {
            var pos = this._calcUIPosition();
            if (pos) {
                this.$toolbar.offset(pos["toolbar"]);
                this.popover.setPosition(pos["popover"]);
            }
        },

        _handleScrolling: function(e) {
            var context = this.editorKernel.getEditContext();
            var scrollTop = (this.$clipParent || $(context.win)).scrollTop();
            if (this._recordedScrollTop !== scrollTop) {
                if (CUI.rte.Common.ua.isTouch && !this.editorKernel.isLocked()) {
                    this.hideTemporarily();
                } else {
                    this._updateUI();
                }
                this._recordedScrollTop = scrollTop;
            }
        },

        _handleUpdateState: function(e) {
            if (!this.editorKernel.isLocked()) {
                switch (e.origin) {
                    case "event":
                        break;
                    case "command":
                        this.popover.hide();
                        break;
                }
                this._updateUI();
            }
        },

        _initializePopovers: function() {
            var self = this;
            this.$container.on("click.rte-toolbar", "button[data-action^=\"#\"]",
                    function(e) {
                        var $trigger = $(this);
                        if (!$trigger.hasClass(CUI.rte.Theme.TOOLBARITEM_DISABLED_CLASS)) {
                            var show = !self.popover.isShown() ||
                                    !self.popover.isTriggeredBy($trigger);
                            self.popover.hide();
                            if (show) {
                                self.popover.use($(e.target).data("action").substring(1),
                                        $trigger, self.$toolbar);
                            }
                            self._updateUI();
                            self.editorKernel.focus();
                            e.stopPropagation();
                        }
                    });
            this.$container.find(".rte-popover").each(function() {
                $(this).pointer("click.rte-toolbar", function(e) {
                    if ($(e.target).attr("disabled") === "disabled") {
                        e.stopPropagation();
                    }
                });
            });
            // initialize single selection triggers (that adapt the icon to the currently
            // chosen child element)
            var $singleSelectTriggers = this.$toolbar.find(".trigger.single-select");
            $singleSelectTriggers.each(function() {
                var icon = CUI.rte.UIUtils.determineIconClass(this);
                var $this = $(this);
                $this.data("base-icon", icon);
                $this.data("current-icon", icon);
            })
        },

        hide: function() {
            this.popover.hide();
            // use "visibility" property instead of "display" - the latter would destroy the
            // layout on show() on Safari Mobile
            this.$toolbar.css("visibility", "hidden");
        },

        isHidden: function() {
            return (this.$toolbar.css("visibility") === "hidden");
        },

        hideTemporarily: function(onShowCallback) {
            if (this._tbHideTimeout) {
                window.clearTimeout(this._tbHideTimeout);
                this._tbHideTimeout = undefined;
            }
            if (!this.isHidden()) {
                this.hide();
            }
            var self = this;
            this._tbHideTimeout = window.setTimeout(function() {
                self.show();
                self._tbHideTimeout = undefined;
                if (onShowCallback) {
                    onShowCallback();
                }
            }, 1000);
        },

        show: function() {
            // use "visibility" property instead of "display" - the latter would destroy the
            // layout on Safari Mobile
            this.$toolbar.css("visibility", "visible");
            this._updateUI();
        },

        getToolbarContainer: function() {
            return this.$container;
        },

        getItem: function(itemId) {
            return this.elementMap[itemId];
        },

        getHeight: function() {
            return 0;
        },

        getPopoverManager: function() {
            return this.popover;
        },

        createPopoverTriggerToElementMapping: function() {
            for (var id in this.elementMap) {
                if (this.elementMap.hasOwnProperty(id)) {
                    var elementDef = this.elementMap[id].element;
                    var action = elementDef.plugin.pluginId + "#" + elementDef.id;
                    var $element = CUI.rte.UIUtils.getElement(action, this.tbType,
                            this.$container);
                    var $popover = $element.parent(".rte-popover");
                    if ($popover.length) {
                        var popoverRef = "#" + $popover.data("id");
                        var $trigger = CUI.rte.UIUtils.getPopoverTrigger(popoverRef,
                                this.tbType, this.$toolbar);
                        this.popover.addTriggerToElement($trigger, $element);
                    }
                }
            }
        },

        triggerUIUpdate: function() {
            this._updateUI();
        },

        startEditing: function(editorKernel) {
            this.editorKernel = editorKernel;
            var context = this.editorKernel.getEditContext();
            this.editorKernel.addUIListener("updatestate", this._handleUpdateState, this);
            this.$toolbar.addClass(CUI.rte.Theme.TOOLBAR_ACTIVE);
            this.$clipParent = CUI.rte.UIUtils.getClippingParent(this.$container);
            this._offsets = this._calcInternalOffsets();
            this._initializePopovers();
            this._updateUI();
            var self = this;
            // Several browsers propagate click events on disabled items to parent elements,
            // others don't. To be sure, cancel all click events that arrive at the toolbar.
            this.$toolbar.pointer("click.rte-toolbar", function(e) {
                if ($(e.target).attr("disabled") === "disabled") {
                    e.stopPropagation();
                }
            });
            // Clicking a button in the toolbar leads to an unwanted focus transfer; ignore
            // it by disabling focus handling on mousedown and enabling it again on
            // mouseup (after blur); event order is: (touchstart) -> (touchend) -> (tap)
            // -> mousedown -> blur (on opposite component) -> mouseup -> (click)
            this.$container.on("mousedown.rte-toolbar", ".item",
                    function(e) {
                        self.editorKernel.disableFocusHandling();
                    });
            $(document).on("mouseup.rte-toolbar",
                    function(e) {
                        self.editorKernel.enableFocusHandling();
                    });
            $(window).on("scroll.rte-toolbar", function(e) {
                self._handleScrolling(e);
            });
            if (this.$clipParent) {
                // provide a onclick handler for the clip parent, as otherwise no click
                // events would be sent to finish editing
                this.$clipParent.on("click.rte-toolbar", function() {
                    // do nothing
                });
                // handle scrolling of the clip parent
                this.$clipParent.on("scroll.rte-toolbar", function(e) {
                    self._handleScrolling(e);
                });
            }
        },

        finishEditing: function() {
            this.popover.hide();
            this.$toolbar.removeClass(CUI.rte.Theme.TOOLBAR_ACTIVE);
            $(window).off("scroll.rte-toolbar");
            this.$container.off("mousedown.rte-toolbar click.rte-toolbar");
            $(document).off("mouseup.rte-toolbar");
            if (this.$clipParent) {
                this.$clipParent.off("scroll.rte-toolbar");
                this.$clipParent.off("click.rte-toolbar");
                this.$clipParent = undefined;
            }
            this._isClipped = false;
            this.editorKernel.removeUIListener("updatestate", this._handleUpdateState,
                    this);
            this.$container.find(".rte-popover").each(function() {
                $(this).off("click.rte-toolbar");
            });
        },

        enable: function() {
            for (var itemId in this.elementMap) {
                if (this.elementMap.hasOwnProperty(itemId)) {
                    var item = this.elementMap[itemId].element;
                    item.setDisabled(false);
                }
            }
        },

        disable: function(excludeItems) {
            if (!this.editorKernel.isLocked()) {
                for (var itemId in this.elementMap) {
                    if (this.elementMap.hasOwnProperty(itemId)) {
                        if (!excludeItems || (excludeItems.indexOf(itemId) < 0)) {
                            var item = this.elementMap[itemId].element;
                            item.setDisabled(true);
                        }
                    }
                }
            }
        },

        destroy: function() {
            // as the toolbar items might be kept on the screen visually, we're disabling
            // them before destroying the data model; otherwise the toolbar will stay active in
            // serveral situations where the blur event doesn't kick in (mainly with mobile
            // devices)
            this.disable();
            for (var itemId in this.elementMap) {
                if (this.elementMap.hasOwnProperty(itemId)) {
                    var item = this.elementMap[itemId].element;
                    if (item.destroy) {
                        item.destroy();
                    }
                }
            }
            this.elementMap = { };
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.PopoverManager = new Class({

        toString: "ToolbarImpl",

        $container: null,

        $popover: null,

        $popoverTrigger: null,

        triggerToElements: null,

        tbType: null,


        construct: function($container, tbType) {
            this.$popover = null;
            this.$popoverTrigger = null;
            this.$container = $container;
            this.triggerToElements = [ ];
            this.tbType = tbType;
        },

        /**
         * Calculates the height of the "arrow" of a popup.
         * @return {Number} The height of the "arrow"
         * @private
         */
        getArrowHeight: function() {
            var $p = this.$popover;
            if (!$p) {
                return 0;
            }
            // arrow height calculation taken from CUI.Popover
            return Math.round(($p.outerWidth() - $p.width()) / 1.5);
        },

        /**
         * Sets the position of the popover and its arrow.
         * @param {{top:Number}, {left:Number}, {arrow:String}} pos The popover position;
         *        valid values for arrow: bottom, top
         */
        setPosition: function(pos) {
            if (this.$popover) {
                this.$popover.removeClass("arrow-bottom  arrow-top");
                this.$popover.addClass("arrow-" + pos["arrow"]);
                this.$popover.offset(pos);
            }
        },

        /**
         * Calculates the height of the current popover.
         * @return {{height: Number, arrowHeight: Number}} The total height height and the
         *         height of the "arrow" of the popover; both values are 0 if no popover is
         *         currently shown
         */
        calc: function() {
            var $p = this.$popover;
            if (!$p) {
                return {
                    "height": 0,
                    "arrowHeight": 0
                };
            }
            // arrow height calculation taken from CUI.Popover
            var arrowHeight = this.getArrowHeight();
            return {
                "height": $p.outerHeight() + arrowHeight,
                "arrowHeight": arrowHeight
            };
        },

        addTriggerToElement: function($trigger, $element) {
            var trigger = $trigger[0];
            var element = $element[0];
            var triggerElements = this.getElementsForTrigger($trigger);
            if (!triggerElements) {
                triggerElements = {
                    "trigger": trigger,
                    "elements": [ ]
                };
                this.triggerToElements.push(triggerElements);
            }
            var elements = triggerElements.elements;
            if (!CUI.rte.Common.arrayContains(elements, element)) {
                elements.push(element);
            }
        },

        getElementsForTrigger: function($trigger) {
            var trigger = $trigger[0];
            var triggerCnt = this.triggerToElements.length;
            for (var t = 0; t < triggerCnt; t++) {
                if (this.triggerToElements[t].trigger === trigger) {
                    return this.triggerToElements[t];
                }
            }
            return undefined;
        },

        getTriggerForElement: function($element) {
            var element = $element[0];
            var triggerCnt = this.triggerToElements.length;
            for (var t = 0; t < triggerCnt; t++) {
                var triggerElements = this.triggerToElements[t];
                var elements = triggerElements.elements;
                var elementCnt = elements.length;
                for (var e = 0; e < elementCnt; e++) {
                    if (elements[e] === element) {
                        return $(triggerElements.trigger);
                    }
                }
            }
            return undefined;
        },

        isShown: function() {
            return !!this.$popover;
        },

        isTriggeredBy: function($trigger) {
            return this.$popoverTrigger && ($trigger[0] === this.$popoverTrigger[0]);
        },

        use: function(ref, $trigger, $toolbar) {
            this.$popoverTrigger = $trigger;
            this.$popoverTrigger.addClass("triggered");
            if (ref.jquery) {
                this.$popover = ref;
            } else {
                this.$popover = CUI.rte.UIUtils.getPopover(ref, this.tbType,
                        this.$container);
            }
            if (this.$popover.length) {
                // calculate & set "arrow" position, using a temporary styleheet to override
                // :before pseudo class
                var triggerOffs = $trigger.offset();
                var toolbarOffs = $toolbar.offset();
                var triggerDX = triggerOffs.left - toolbarOffs.left;
                var arrowSize = this.getArrowHeight();
                var arrowOffs = Math.round(($trigger.width() / 2) + triggerDX - arrowSize) +
                        2;
                this._popoverStyleSheet = CUI.rte.UIUtils.addStyleSheet({
                    ".name": ".temp-arrow-position:before",
                    "left": arrowOffs + "px !important"
                });
                this.$popover.addClass("temp-arrow-position");
                // must be shown before calculating positions, as jQuery will miscalculate
                // position:absolute otherwise
                this.$popover.popover({
                    pointAt: $([]),
                    preventAutoHide: true
                }).popover("show");
            } else {
                this.$popover = null;
            }
        },

        hide: function() {
            if (this.$popoverTrigger) {
                this.$popoverTrigger.removeClass("triggered");
                this.$popoverTrigger = null;
            }
            var mustHide = !!this.$popover;
            if (mustHide) {
                this.$popover.removeClass("temp-arrow-position");
                CUI.rte.UIUtils.removeStyleSheet(this._popoverStyleSheet);
                this._popoverStyleSheet = null;
                this.$popover.popover("hide");
                this.$popover = null;
            }
            return mustHide;
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.ElementImpl = new Class({

        toString: "ElementImpl",

        extend: CUI.rte.ui.TbElement,

        dom: null,

        $ui: null,


        notifyGroupBorder: function(isFirst) {
            // TODO ...?
        },


        // Interface implementation ------------------------------------------------------------

        addToToolbar: function(toolbar) {
            var commandRef = this.plugin.pluginId + "#" + this.id;
            toolbar.push({
                "ref": commandRef,
                "plugin": this.plugin.pluginId,
                "command": this.id
            });
        },

        notifyToolbar: function(toolbar) {
            this.toolbar = toolbar;
            var pluginId = this.plugin.pluginId;
            var $cont = $(toolbar.getToolbarContainer());
            var self = this;
            this.$ui = $cont.find('button[data-action="' + pluginId + '#' + this.id + '"]');
            this.$ui.on("click.rte-handler", function(e) {
                if (!self.$ui.hasClass(CUI.rte.Theme.TOOLBARITEM_DISABLED_CLASS)) {
                    var editContext = self.plugin.editorKernel.getEditContext();
                    editContext.setState("CUI.SelectionLock", 1);
                    var cmd = (self.cmdDef ? self.cmdDef.cmd : self.id);
                    var cmdValue = (self.cmdDef ? self.cmdDef.cmdValue : undefined);
                    var env = {
                        "editContext": editContext
                    };
                    self.plugin.execute(cmd, cmdValue, env);
                    self.plugin.editorKernel.enableFocusHandling();
                    self.plugin.editorKernel.focus(editContext);
                }
                e.stopPropagation();
            });
        },

        createToolbarDef: function() {
            return {
                "id": this.id,
                "element": this
            };
        },

        setDisabled: function(isDisabled) {
            var com = CUI.rte.Common;
            if (com.ua.isTouch) {
                // This is a really, really ugly workaround for another SafariMobile
                // bug: We need to set "display" to "none" before modifying the class
                // attribute. Otherwise SafariMobile will cancel edit mode immediately
                // by finally hiding the keyboard (and not showing it again
                // programmatically, using focus() for example) - see CUI-649
                this.$ui.css("display", "none");
            }
            if (isDisabled) {
                this.$ui.addClass(CUI.rte.Theme.TOOLBARITEM_DISABLED_CLASS);
                this.$ui.attr("disabled", "disabled");
            } else {
                this.$ui.removeClass(CUI.rte.Theme.TOOLBARITEM_DISABLED_CLASS);
                this.$ui.removeAttr("disabled");
            }
            if (com.ua.isTouch) {
                // part 2 of really, really ugly workaround ....
                var self = this;
                window.setTimeout(function() {
                    self.$ui.css("display", "inline-block");
                }, 1);
            }
        },

        setSelected: function(isSelected, suppressEvent) {
            this._isSelected = isSelected;
            if (isSelected) {
                this.$ui.addClass(CUI.rte.Theme.TOOLBARITEM_SELECTED_CLASS);
            } else {
                this.$ui.removeClass(CUI.rte.Theme.TOOLBARITEM_SELECTED_CLASS);
            }
            var pm = this.toolbar.getPopoverManager();
            var $trigger = pm.getTriggerForElement(this.$ui);
            if ($trigger && $trigger.length) {
                var elements = pm.getElementsForTrigger($trigger);
                elements = (elements ? elements.elements : [ ]);
                var selected = [ ];
                var elementCnt = elements.length;
                for (var e = 0; e < elementCnt; e++) {
                    var $el = $(elements[e]);
                    if ($el.hasClass(CUI.rte.Theme.TOOLBARITEM_SELECTED_CLASS)) {
                        selected.push($el);
                    }
                }
                if (selected.length > 0) {
                    $trigger.addClass("items-selected");
                } else {
                    $trigger.removeClass("items-selected");
                }
                var baseIcon = $trigger.data("base-icon");
                if (baseIcon) {
                    var targetIcon = baseIcon;
                    if (selected.length === 1) {
                        var selIcon = CUI.rte.UIUtils.determineIconClass(selected[0]);
                        targetIcon = (selIcon ? selIcon : targetIcon);
                    }
                    var currentIcon = $trigger.data("current-icon");
                    if (currentIcon !== targetIcon) {
                        if (currentIcon) {
                            $trigger.removeClass(currentIcon);
                        }
                        $trigger.addClass(targetIcon);
                        $trigger.data("current-icon", targetIcon);
                    }
                }
            }
        },

        isSelected: function() {
            return this._isSelected;
        },

        destroy: function() {
            this.$ui.off("click.rte-handler");
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.ParaFormatterImpl = new Class({

        toString: "ParaFormatterImpl",

        extend: CUI.rte.ui.TbParaFormatter,


        // Stuff -------------------------------------------------------------------------------

        notifyGroupBorder: function() {
            // do nothing
        },


        // Interface implementation ------------------------------------------------------------

        addToToolbar: function(toolbar) {
            this.toolbar = toolbar;
            // TODO ...?
        },

        createToolbarDef: function() {
            return {
                "id": this.id,
                "element": this
            };
        },

        initializeSelector: function() {
            // TODO ...?
        },

        selectFormat: function(formatToSelect, auxRoot, formatCnt, noFormatCnt) {
            // TODO ...?
        },

        getSelectorDom: function() {
            return null;
        },

        getSelectedFormat: function() {
            return null;
        },

        setDisabled: function(isDisabled) {
            /*
            if (isDisabled) {
                this.$ui.addClass("rte-tbi-disabled");
            } else {
                this.$ui.removeClass("rte-tbi-disabled");
            }
            */
        },

        setSelected: function(isSelected, suppressEvent) {
            this._isSelected = isSelected;
            /*
            if (isSelected) {
                this.$ui.addClass("rte-tbi-selected");
            } else {
                this.$ui.removeClass("rte-tbi-selected");
            }
            */
        },

        isSelected: function() {
            return this._isSelected;
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.StyleSelectorImpl = new Class({

        toString: "StyleSelectorImpl",

        extend: CUI.rte.ui.TbStyleSelector,

        // Helpers -----------------------------------------------------------------------------

        notifyGroupBorder: function() {
            // do nothing
        },


        // Interface implementation ------------------------------------------------------------

        addToToolbar: function(toolbar) {
            // TODO ...?
        },

        createToolbarDef: function() {
            return {
                "id": this.id,
                "element": this
            };
        },

        initializeSelector: function() {
            // TODO ...?
        },

        getSelectorDom: function() {
            return { };
        },

        getSelectedStyle: function() {
            return null;
        },

        setRemoveDisabled: function(isDisabled) {
            // TODO ...?
        },

        setDisabled: function(isDisabled) {
            /*
            if (isDisabled) {
                this.$ui.addClass("rte-tbi-disabled");
            } else {
                this.$ui.removeClass("rte-tbi-disabled");
            }
            */
        },

        setSelected: function(isSelected, suppressEvent) {
            this._isSelected = isSelected;
            /*
            if (isSelected) {
                this.$ui.addClass("rte-tbi-selected");
            } else {
                this.$ui.removeClass("rte-tbi-selected");
            }
            */
        },

        isSelected: function() {
            return this._isSelected;
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    var ICONS = {

        // Popover triggers
        "#format": "icon-text",
        "#justify": "icon-textleft",
        "#lists": "icon-textbulleted",

        // Commands
        "format#bold": "icon-textbold",
        "format#italic": "icon-textitalic",
        "format#underline": "icon-textunderline",
        "justify#justifyleft": "icon-textleft",
        "justify#justifycenter": "icon-textcenter",
        "justify#justifyright": "icon-textright",
        "lists#insertunorderedlist": "icon-textbulleted",
        "lists#insertorderedlist": "icon-textnumbered",
        "lists#outdent": "icon-textindentdecrease",
        "lists#indent": "icon-textindentincrease",
        "links#modifylink": "icon-link",
        "links#unlink": "icon-linkoff",
        "control#close": "icon-close"
    };

    var CLASSES = {
        "#format": "multi-select",
        "#justify": "single-select",
        "control#close": "modechanger"
    };


    CUI.rte.ui.cui.CuiToolbarBuilder = new Class({

        toString: "CuiToolbarBuilder",

        extend: CUI.rte.ui.ToolbarBuilder,


        // Helpers -------------------------------------------------------------------------

        _getUISettings: function(options) {
            var uiSettings = undefined;
            if (options && options.uiSettings && options.uiSettings.cui) {
                uiSettings = options.uiSettings.cui;
            } else {
                uiSettings = CUI.rte.ui.cui.DEFAULT_UI_SETTINGS;
            }
            return uiSettings;
        },

        _registerIcons: function(iconDefs) {
            if (!iconDefs) {
                return;
            }
            CUI.rte.Common.removeJcrData(iconDefs);
            for (var node in iconDefs) {
                if (iconDefs.hasOwnProperty(node)) {
                    var icon = iconDefs[node];
                    if (icon.command && icon.icon) {
                        this.registerIcon(icon.command, icon.icon);
                    }
                }
            }
        },

        registerIcon: function(commandRef, iconClass) {
            ICONS[commandRef] = iconClass;
        },

        _getIconForCommand: function(commandRef) {
            if (ICONS.hasOwnProperty(commandRef)) {
                return ICONS[commandRef];
            }
            return undefined;
        },

        _registerAllAdditionalClasses: function(clsDefs) {
            var com = CUI.rte.Common;
            if (!clsDefs) {
                return;
            }
            com.removeJcrData(clsDefs);
            for (var node in clsDefs) {
                if (clsDefs.hasOwnProperty(node)) {
                    var clsDef = clsDefs[node];
                    if (clsDef.command && !com.isNull(clsDef.classes)) {
                        this.registerAdditionalClasses(clsDef.command, clsDef.classes);
                    }
                }
            }
        },

        /**
         * @param {String} commandRef The command refence (#trigger for popup triggers;
         *        plugin#command for active RTE buttons
         * @param {String} cssClasses Additional CSS classes; space separated
         */
        registerAdditionalClasses: function(commandRef, cssClasses) {
            CLASSES[commandRef] = cssClasses;
        },

        _getClassesForCommand: function(commandRef) {
            if (CLASSES.hasOwnProperty(commandRef)) {
                var classes = CLASSES[commandRef];
                return classes;
            }
            return undefined;
        },

        _buildToolbar: function($editable, elements, options) {

            function getItem(id) {
                var itemCnt = items.length;
                for (var i = 0; i < itemCnt; i++) {
                    if (items[i].ref === id) {
                        return items[i];
                    }
                }
                return null;
            }

            var com = CUI.rte.Common;
            var uiSettings = this._getUISettings(options);
            var addClasses;

            var items = [ ];
            for (var e = 0; e < elements.length; e++) {
                elements[e].addToToolbar(items);
            }
            // reorder according to settings
            com.removeJcrData(uiSettings);
            var toolbars = [ ];
            var toolbarTpl = CUI.rte.Templates["toolbar"];
            var itemTpl = CUI.rte.Templates["toolbar-item"];
            var triggerTpl = CUI.rte.Templates["popover-trigger"];
            var popoverTpl = CUI.rte.Templates["popover"];
            var popoverItemTpl = CUI.rte.Templates["popover-item"];
            var separatorTpl = CUI.rte.Templates["separator"];
            for (var tbId in uiSettings) {
                if (uiSettings.hasOwnProperty(tbId)) {
                    var toolbar = uiSettings[tbId];
                    var tbItems = [ ];
                    var popovers = [ ];
                    var itemDefs = toolbar.toolbar;
                    if (!itemDefs) {
                        continue;
                    }

                    // toolbar
                    var itemCnt = itemDefs.length;
                    for (var i = 0; i < itemCnt; i++) {
                        var itemToAdd = itemDefs[i];
                        if (itemToAdd && itemToAdd.length) {
                            if (itemToAdd.charAt(0) === "#") {
                                // popover trigger
                                addClasses = this._getClassesForCommand(itemToAdd);
                                addClasses = (addClasses ? " " + addClasses : "");
                                tbItems.push(triggerTpl({
                                    "ref": itemToAdd,
                                    "icon": this._getIconForCommand(itemToAdd),
                                    "addClasses": addClasses
                                }));
                            } else if (itemToAdd === "-") {
                                // separator
                                tbItems.push(separatorTpl());
                            } else {
                                // regular item
                                var element = getItem(itemToAdd);
                                if (element) {
                                    addClasses = this._getClassesForCommand(itemToAdd);
                                    addClasses = (addClasses ? " " + addClasses : "");
                                    element.icon = element.icon ||
                                            this._getIconForCommand(element.ref);
                                    element.addClasses = addClasses;
                                    tbItems.push(itemTpl(element));
                                }
                            }
                        }
                    }
                    // popovers
                    var popoverDefs = toolbar.popovers;
                    if (!popoverDefs) {
                        continue;
                    }

                    com.removeJcrData(popoverDefs);
                    for (var p in popoverDefs) {
                        if (popoverDefs.hasOwnProperty(p)) {
                            var poItems = [ ];
                            var popoverToProcess = popoverDefs[p];
                            var poItemDefs = popoverToProcess.items;
                            var poItemCnt = poItemDefs.length;
                            for (var pi = 0; pi < poItemCnt; pi++) {
                                if (poItemDefs[pi] !== "-") {
                                    // popover item
                                    var poItem = getItem(poItemDefs[pi]);
                                    if (poItem) {
                                        var cmd = poItem.ref;
                                        addClasses = this._getClassesForCommand(cmd);
                                        addClasses = (addClasses ? " " + addClasses : "");
                                        poItem.icon =
                                                poItem.icon || this._getIconForCommand(cmd);
                                        poItem.addClasses = addClasses;
                                        poItems.push(popoverItemTpl(poItem));
                                    }
                                } else {
                                    // popover separator
                                    poItems.push(separatorTpl());
                                }
                            }
                            popovers.push(popoverTpl({
                                "ref": popoverToProcess.ref,
                                "popoverItems": poItems
                            }));
                        }
                    }
                    // add representation
                    toolbars.push({
                        "id": tbId,
                        "toolbar": toolbarTpl({
                            "toolbarItems": tbItems
                        }),
                        "popovers": popovers
                    });
                }
            }
            var $toolbar = $(CUI.rte.Templates["tb-container"]({
                "toolbars": toolbars
            }));
            var $ui = CUI.rte.UIUtils.createOrGetUIContainer($editable);
            $ui.append($toolbar)
        },


        // Toolbar management --------------------------------------------------------------

        /**
         * Create the abstracted toolbar.
         * @return {CUI.rte.ui.Toolbar} The toolbar
         * @ignore
         */
        createToolbar: function(options) {
            var toolbarItems = [ ];
            var elements = [ ];
            var elementMap = { };
            var groupCnt = this.groups.length;

            // create data model
            var hasMembers = false;
            for (var groupIndex = 0; groupIndex < groupCnt; groupIndex++) {
                var groupElements = this.groups[groupIndex].elements;
                var elCnt = groupElements.length;
                for (var elIndex = 0; elIndex < elCnt; elIndex++) {
                    var element = groupElements[elIndex].def;
                    if ((elIndex == 0) && hasMembers) {
                        toolbarItems.push("-");
                        hasMembers = false;
                    }
                    var toolbarDef = element.createToolbarDef();
                    if (toolbarDef != null) {
                        if (!CUI.rte.Utils.isArray(toolbarDef)) {
                            toolbarDef = [ toolbarDef ];
                        }
                        var itemCnt = toolbarDef.length;
                        for (var i = 0; i < itemCnt; i++) {
                            var def = toolbarDef[i];
                            toolbarItems.push(def);
                            elementMap[def.id] = def;
                        }
                        elements.push(element);
                        hasMembers = true;
                    }
                }
            }

            // register additional/override existing icons, if available
            var uiSettings = this._getUISettings(options);
            if (uiSettings && uiSettings.hasOwnProperty("icons")) {
                this._registerIcons(uiSettings["icons"]);
                delete uiSettings["icons"];
            }
            if (uiSettings && uiSettings.hasOwnProperty("additionalClasses")) {
                this._registerAllAdditionalClasses(uiSettings["additionalClasses"]);
                delete uiSettings["additionalClasses"];
            }

            // attach model to UI/create UI from model
            var $editable = options.$editable;
            var $toolbar = CUI.rte.UIUtils.getToolbar($editable);
            var elementCnt = elements.length;
            if (!$toolbar) {
                // create new toolbar if none is present yet
                this._buildToolbar($editable, elements, options);
            }

            // use existing/newly created toolbar
            var toolbar = new CUI.rte.ui.cui.ToolbarImpl(elementMap, $editable);
            for (var e = 0; e < elementCnt; e++) {
                elements[e].notifyToolbar(toolbar);
            }
            toolbar.createPopoverTriggerToElementMapping();
            return toolbar;
        },


        // Creating elements -------------------------------------------------------------------

        createElement: function(id, plugin, toggle, tooltip, css, cmdDef) {
            return new CUI.rte.ui.cui.ElementImpl(id, plugin, toggle, tooltip, css,
                    cmdDef);
        },

        createParaFormatter: function(id, plugin, tooltip, formats) {
            return new CUI.rte.ui.cui.ParaFormatterImpl(id, plugin, false, tooltip, false,
                    undefined, formats);
        },

        createStyleSelector: function(id, plugin, tooltip, styles) {
            return new CUI.rte.ui.cui.StyleSelectorImpl(id, plugin, false, tooltip, false,
                    undefined, styles);
        }

    });

    CUI.rte.ui.cui.DEFAULT_UI_SETTINGS = {
        "inline": {
            "toolbar": [
                "#format",
                "-",
                "#justify",
                "-",
                "#lists",
                "-",
                "links#modifylink",
                "links#unlink",
                "-",
                "control#close"
            ],
            "popovers": {
                "format": {
                    "ref": "format",
                    "items": [
                        "format#bold",
                        "format#italic",
                        "format#underline"
                    ]
                },
                "justify": {
                    "ref": "justify",
                    "items": [
                        "justify#justifyleft",
                        "justify#justifycenter",
                        "justify#justifyright"
                    ]
                },
                "lists": {
                    "ref": "lists",
                    "items": [
                        "lists#insertunorderedlist",
                        "lists#insertorderedlist",
                        "lists#outdent",
                        "lists#indent"
                    ]
                }
            }
        }
        // TODO add default config for full screen mode; introduce * wildcard there
    };

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    /**
     * @class CUI.rte.ui.cui.CmItemImpl
     * @private
     */
    CUI.rte.ui.cui.CmItemImpl = new Class({

        toString: "CmItemImpl",

        extend: CUI.rte.ui.CmItem,

        /**
         * @cfg {Object} text Descriptive text for the context menu item
         * @ignore
         */
        text: null,

        /**
         * The selection context (contains selection definition + node list represented by
         * the selection).
         * @type Object
         * @private
         */
        selectionContext: null,

        /**
         * The edit context to be used
         * @type CUI.rte.EditContext
         * @private
         */
        editContext: null,


        construct: function(config) {
            // TODO ...
            CUI.rte.Utils.apply(this, config);
        },

        build: function(items, editorKernel, editContext, selectionContext) {
            this.editorKernel = editorKernel;
            this.selectionContext = selectionContext;
            this.editContext = editContext;
            // TODO ...
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {


    /**
     * @class CUI.rte.ui.ext.CmSeparatorImpl
     * @private
     */
    CUI.rte.ui.cui.CmSeparatorImpl = new Class({

        toString: "CmSeparatorImpl",

        extend: CUI.rte.ui.CmSeparator,

        build: function(items) {
            // TODO implement
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.CuiContextMenuBuilder = new Class({

        toString: "CuiContextMenuBuilder",

        extend: CUI.rte.ui.ContextMenuBuilder,


        construct: function(editorKernel) {
            // TODO ...?
        },

        build: function(selectionContext, context) {
            // TODO ...?
            return { };
        },

        createItem: function(config) {
            return new CUI.rte.ui.stub.CmItemImpl(config);
        },

        createSeparator: function() {
            return new CUI.rte.ui.stub.CmSeparatorImpl();
        },

        showAt: function(x, y) {
            // TODO ...?
        },

        hideAll: function() {
            // TODO ...?
        },

        isVisible: function() {
            return false;
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.Mask = new Class({

        $mask: null,

        show: function() {
            // ignore on touch devices - will not work; SafariMobile screws up completely
            if (!CUI.rte.Common.ua.isTouch) {
                var $body = $("body");
                this.$mask = $("<div></div>");
                this.$mask.addClass("rte-dialog-mask");
                var maskHeight = document.body.scrollHeight;
                this.$mask.height(maskHeight);
                $body.append(this.$mask);
            }
        },

        hide: function() {
            if (!CUI.rte.Common.ua.isTouch) {
                this.$mask.off("click.rte-dialog-mask");
                this.$mask.remove();
            }
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    function requiresFocus(dom) {
        var $dom = $(dom);
        return $dom.is("input:text");
    }

    CUI.rte.ui.cui.AbstractDialog = new Class({

        config: null,

        dialogHelper: null,

        range: null,

        $editable: null,

        $container: null,

        $toolbar: null,

        $trigger: null,

        $dialog: null,

        mask: null,

        /**
         * @private
         */
        editorKernel: null,

        /**
         * @private
         */
        popoverManager: null,


        construct: function(config) {
            CUI.rte.Utils.apply(this, config);
            var self = this;
            var dataType = this.getDataType();
            var mode = config.mode;
            this.$dialog = CUI.rte.UIUtils.getDialog(dataType, mode, this.$container);
            if (!this.$dialog.length) {
                this.$dialog = $(CUI.rte.Templates["dlg-" + dataType](config));
                var $container = CUI.rte.UIUtils.getUIContainer(this.$editable);
                var space = mode || "global";
                var $dlgSpace = CUI.rte.UIUtils.getSpace(space, $container);
                $dlgSpace.append(this.$dialog);
            }
            this.$dialog.finger("tap.rte-dialog click.rte-dialog", function(e) {
                if (!requiresFocus(e.target)) {
                    self.editorKernel.focus();
                    if (self.range) {
                        CUI.rte.Selection.selectRangeBookmark(
                                self.editorKernel.getEditContext(), self.range);
                    }
                } else {
                    CUI.rte.UIUtils.killEvent(e);
                }
            });
            this.$dialog.on("click.rte-dialog", "button[data-type=\"apply\"]",
                    function(e) {
                        self.apply();
                        e.stopPropagation();
                    });
            this.$dialog.on("click.rte-dialog", "button[data-type=\"cancel\"]",
                    function(e) {
                        self.cancel();
                        e.stopPropagation();
                    });
            this.mask = new CUI.rte.ui.cui.Mask();
        },

        destroy: function() {
            this.$dialog.off("tap.rte-dialog click.rte-dialog");
        },

        initializeEdit: function(editorKernel, objToEdit, applyFn) {
            this.editorKernel = editorKernel;
            this.popoverManager = this.editorKernel.toolbar.popover;
            this.objToEdit = objToEdit;
            this.applyFn = applyFn;
            // TODO adjust to custom config (post 5.6.1)
            this.fromModel();
        },

        show: function() {
            this.range = CUI.rte.Selection.createRangeBookmark(
                    this.editorKernel.getEditContext());
            this.popoverManager.hide();
            if (this.$dialog) {
                this.popoverManager.use(this.$dialog, this.$trigger, this.$toolbar);
                this.editorKernel.lock();
                this.editorKernel.fireUIEvent("dialogshow");
                // TODO mask is currently on top of everything - dialog included
                // this.mask.show();
                // maually do the layout - is required here because the editor is already
                // locked, so automatic update will not work
                this.editorKernel.toolbar.triggerUIUpdate();
            }
        },

        hide: function() {
            this.popoverManager.hide();
            this.editorKernel.focus();
            this.editorKernel.unlock();
            CUI.rte.Selection.selectRangeBookmark(this.editorKernel.getEditContext(),
                    this.range);
            this.editorKernel.fireUIEvent("dialoghide");
            // TODO mask is currently on top of everything - dialog included
            // this.mask.hide();
            // hide the toolbar temporarily on touch devices, as the device will most
            // likely do some screen updates immediately after the command is executed and
            // the dialog is hidden - so this should result in a less disruptive UI behavior
            if (CUI.rte.Common.ua.isTouch) {
                this.editorKernel.toolbar.hideTemporarily();
            }
        },

        apply: function() {
            if (this.validate()) {
                this.toModel();
                this.hide();
                if (this.applyFn) {
                    this.applyFn(this.editContext, this.objToEdit);
                }
            }
        },

        cancel: function() {
            this.hide();
        },

        getFieldByType: function(name) {
            var $field = this.$dialog.find("*[data-type=\"" + name + "\"]");
            if ($field.length > 0) {
                return $field;
            }
            return undefined;
        },

        /**
         * Gets a dialog parameter by its name.
         * @param {String} name The parameter's name
         * @return {Object} The parameter's value; null if no such parameter is defined
         */
        getParameter: function(name) {
            var params = this.config.parameters;
            if (params && params[name]) {
                return params[name];
            }
            return undefined;
        },

        getDataType: function() {
            throw new Error("DialogImpl#getDataType must be overridden.");
        },

        preprocessModel: function() {
            // this method may be overridden by implementing dialogs to pre-process
            // the model before the fromModel()-methods are being executed
        },

        dlgFromModel: function() {
            // this method may be overridden by implementing dialogs to transfer basic data
            // from model to view
        },

        fromModel: function() {
            this.preprocessModel();
            // TODO handle additional fields (backwards compatibility)
            this.dlgFromModel();
        },

        validate: function() {
            // may be overridden by implementing dialog
            return true;
        },

        dlgToModel: function() {
            // this method may be overridden by implementing dialogs to transfer basic data
            // from view to model
        },

        postprocessModel: function() {
            // this method may be overridden by implementing dialogs to post-process
            // the model after all toModel()-methods have been executed
        },

        toModel: function() {
            this.dlgToModel();
            // TODO handle additional fields (backwards compatibility)
            this.postprocessModel();
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.LinkBaseDialog = new Class({

        extend: CUI.rte.ui.cui.AbstractDialog,

        toString: "LinkBaseDialog",

        getDataType: function() {
            return "link";
        },

        preprocessModel: function() {
            if (this.objToEdit && this.objToEdit.dom) {
                this.objToEdit.href = CUI.rte.HtmlRules.Links.getLinkHref(
                        this.objToEdit.dom);
                var com = CUI.rte.Common;
                var attribNames = com.getAttributeNames(this.objToEdit.dom, false,
                    function(dom, attribName, attribNameLC) {
                        // exclude href, rte_href & target from generic attribute handling,
                        // as they are handled explicitly and not generically
                        return attribNameLC == com.HREF_ATTRIB || attribNameLC == "href"
                                || attribNameLC == "target";
                    });
                for (var i = 0; i < attribNames.length; i++) {
                    var attribName = attribNames[i];
                    var value = com.getAttribute(this.objToEdit.dom, attribName);
                    if (typeof value !== 'undefined') {
                        this.objToEdit.attributes[attribName] = value;
                    }
                }
            }
        },

        dlgFromModel: function() {
            var hrefField = this.getFieldByType("href");
            if (hrefField) {
                var value = "";
                if (this.objToEdit) {
                    var href = this.objToEdit.href;
                    if (href) {
                        value = href;
                    }
                }
                hrefField.val(value);
            }
            var targetBlankField = this.getFieldByType("targetBlank");
            if (targetBlankField) {
                var target = (this.objToEdit && this.objToEdit.target
                        ? this.objToEdit.target.toLowerCase() : null);
                targetBlankField.val([ target == "_blank" ? "true" : "false" ]);
            }
        },

        validate: function() {
            var hrefField = this.getFieldByType("href");
            if (hrefField) {
                var href = hrefField.val();
                if (href && (href.length > 0)) {
                    return true;
                }
            }
            return false;
        },

        dlgToModel: function() {
            if (this.objToEdit) {
                var hrefField = this.getFieldByType("href");
                if (hrefField) {
                    var href = hrefField.val();
                    if (href) {
                        this.objToEdit.href = href;
                    }
                }
                var targetBlankField = this.getFieldByType("targetBlank");
                if (targetBlankField) {
                    var blankValue;
                    if (targetBlankField.is("input:radio")) {
                        blankValue = targetBlankField.filter(":checked").val();
                    } else {
                        blankValue = targetBlankField.val();
                    }
                    if (blankValue === "true") {
                        this.objToEdit.target = "_blank";
                    } else {
                        this.objToEdit.target = null;
                    }
                }
            }
        },

        postprocessModel: function() {
            var linkRules = this.getParameter("linkRules");
            if (linkRules) {
                linkRules.applyToObject(this.objToEdit);
            }
       }

    });


})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    CUI.rte.ui.cui.CuiDialogManager = new Class({

        toString: "CuiDialogManager",

        extend: CUI.rte.ui.DialogManager,

        editorKernel: null,

        construct: function(editorKernel) {
            this.editorKernel = editorKernel;
        },

        create: function(dialogId, config) {
            // TODO ... used by find/replace, for example
            return { };
        },

        mustRecreate: function(dialog) {
            return false;
        },

        show: function(dialog) {
            dialog.show();
        },

        hide: function(dialog) {
            dialog.hide();
        },

        alert: function(title, message, fn) {
            // TODO ...?
        },

        createDialogHelper: function() {
            return new CUI.rte.ui.cui.CuiDialogHelper(this.editorKernel);
        }

    });

})(window.jQuery);
/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function($) {

    var TYPES = {
        "rtelinkdialog": CUI.rte.ui.cui.LinkBaseDialog
    };

    CUI.rte.ui.cui.CuiDialogHelper = new Class({

        toString: "CuiDialogHelper",

        extend: CUI.rte.ui.DialogHelper,

        /**
         * @protected
         * @ignore
         */
        instantiateDialog: function(dialogConfig) {
            var type = dialogConfig.type;
            if (!TYPES.hasOwnProperty(type)) {
                throw new Error("Unknown dialog type: " + type);
            }
            var cls = TYPES[type];
            var context = this.editorKernel.getEditContext();
            var $editable = $(context.root);
            var $container = CUI.rte.UIUtils.getUIContainer($editable);
            var $toolbar = this.editorKernel.toolbar.$toolbar;
            var $trigger = $toolbar.parent().find(
                    "button[data-action=\"" + dialogConfig.parameters.command + "\"]");
            return new cls({
                "config": dialogConfig,
                "$editable": $editable,
                "$container": $container,
                "$toolbar": $toolbar,
                "$trigger": $trigger
            });
        },

        createItem: function(type, name, label) {
            return { };
        },

        getItemType: function(item) {
            return "unknown";
        },

        getItemName: function(item) {
            if (!item.id) {
                item.id = "id-" + new Date().getTime();
            }
            return item.id;
        },

        getItemValue: function(item) {
            return item.value;
        },

        setItemValue: function(item, value) {
            item.value = value;
        },

        calculateInitialPosition: function() {
            // not required here - the position is managed by CUI.rte.ui.cui.PopupManager
        }

    });

})(window.jQuery);
(function($) {

    var configs = { };

    CUI.RichText = new Class(/** @lends CUI.RichText# */ {

        toString:'RichText',

        extend:CUI.Widget,

        editorKernel: null,

        savedSpellcheckAttrib: null,

        savedOutlineStyle: null,

        isActive: false,

        /**
         * Flag to ignore the next "out of area" click event
         * @private
         * @type Boolean
         */
        ignoreNextClick: false,


        construct: function(options) {
            this.options = options || { };
            if (this.options.hasOwnProperty("$ui")) {
                this.$element.data("rte-ui", this.options.$ui);
            }
        },

        // Helpers -------------------------------------------------------------------------

        _hidePopover: function() {
            if (this.editorKernel.toolbar) {
                var tb = this.editorKernel.toolbar;
                if (tb.popover) {
                    return tb.popover.hide();
                }
            }
            return false;
        },

        _finishRequested: function() {
            this.finish(false);
        },

        _handleToolbarOnSelectionChange: function() {
            var com = CUI.rte.Common;
            var editContext = this.editorKernel.getEditContext();
            var $doc = $(editContext.doc);
            var self = this;
            if (com.ua.isTouch) {
                // On touch devices (Safari Mobile), no touch events are dispatched while
                // the user defines a selection. As a workaround, we listen to
                // selectionchange events instead (which at least indicate changes in the
                // selection, but not when the selection process starts or ends). To
                // determine the end of the selection process, a timed "best guess" approach
                // is used - currently, the selection is declared "final" if it does not
                // change for a second. This works well even if the user changes the
                // selection after the 1sec interval - simply another cycle of
                // hiding/showing the toolbar gets started in that case.
                var _lastSel;
                $doc.on("selectionchange.rte-toolbarhide", function(e) {
                    if (self.editorKernel.isLocked() || !self.isActive) {
                        _lastSel = undefined;
                        return;
                    }
                    var context = self.editorKernel.getEditContext();
                    // using native selection instead of selection abstraction here, as
                    // it is faster and we are in a controlled environment (Webkit mobile)
                    // here
                    var slct = context.win.getSelection();
                    // check if selection is valid - if not, reuse last known selection or
                    // set caret to the start of the text
                    if (!com.isAncestor(context, context.root, slct.focusNode) ||
                            !com.isAncestor(context, context.root, slct.anchorNode)) {
                        slct.removeAllRanges();
                        var range = context.doc.createRange();
                        if (_lastSel) {
                            range.setStart(_lastSel.ande, _lastSel.aoffs);
                            range.setEnd(_lastSel.fnde, _lastSel.foffs);
                        } else {
                            range.selectNodeContents(context.root);
                            range.collapse(true);
                        }
                        slct.addRange(range);
                    }
                    if (!slct.isCollapsed) {
                        var locks = context.getState("CUI.SelectionLock");
                        if (locks === undefined) {
                            var isSameSelection = false;
                            if (_lastSel) {
                                isSameSelection =
                                        (_lastSel.ande === slct.anchorNode) &&
                                        (_lastSel.aoffs === slct.anchorOffset) &&
                                        (_lastSel.fnde === slct.focusNode) &&
                                        (_lastSel.foffs === slct.focusOffset);
                            }
                            if (!isSameSelection) {
                                self.editorKernel.toolbar.hideTemporarily();
                            }
                        } else {
                            locks--;
                            if (locks > 0) {
                                context.setState("CUI.SelectionLock", locks);
                            } else {
                                context.setState("CUI.SelectionLock");
                            }
                        }
                    }
                    _lastSel = {
                        ande: slct.anchorNode,
                        aoffs: slct.anchorOffset,
                        fnde: slct.focusNode,
                        foffs: slct.focusOffset
                    };
                });
            } else {
                var _isClick = false;
                var _isToolbarHidden = false;
                this.$textContainer.pointer("mousedown.rte-toolbarhide", function(e) {
                    _isClick = true;
                });
                this.$textContainer.pointer("mousemove.rte-toolbarhide", function(e) {
                    if (_isClick && !_isToolbarHidden && !self.editorKernel.isLocked()) {
                        self.editorKernel.toolbar.hide();
                        _isToolbarHidden = true;
                    }
                });
                this.$textContainer.pointer("mouseup.rte-toolbarhide", function(e) {
                    if (_isToolbarHidden) {
                        self.editorKernel.toolbar.show();
                        _isToolbarHidden = false;
                    }
                    _isClick = false;
                });
            }
        },

        getTextDiv: function(parentEl) {
            return parentEl;
        },

        isEmptyText: function() {
            return false;
            /*
            var spanDom = CQ.Ext.DomQuery.selectNode("span:first", this.textContainer);
            if (!spanDom) {
                return false;
            }
            var spanEl = CQ.Ext.get(spanDom);
            return spanEl.hasClass(CQ.themes.TextEditor.EMPTY_COMPONENT_CLASS);
            */
        },

        prepareForNewText: function() {
            /*
            CQ.form.rte.Common.removeAllChildren(this.textContainer);
            */
        },

        handleKeyUp: function(e) {
            if (!this.editorKernel.isLocked()) {
                this._hidePopover();
            }
            if (e.getCharCode() === 27) {
                this.finish(true);
            }
        },

        initializeEditorKernel: function(initialContent) {
            var com = CUI.rte.Common;
            this.editorKernel.addUIListener("updatestate", this.updateState, this);
            var doc = this.textContainer.ownerDocument;
            var win = com.getWindowForDocument(doc);
            this.editorKernel.initializeEditContext(win, doc, this.textContainer);
            this.editorKernel.initializeEventHandling();
            this.editorKernel.setUnprocessedHtml(initialContent || "");
            this.editorKernel.initializeCaret(true);
            this.editorKernel.execCmd("initializeundo");
            this.editorKernel.addUIListener("requestClose", this._finishRequested, this);
            if (CUI.rte.Common.ua.isTouch) {
                // show the toolbar with a slight delay on touch devices; this looks a lot
                // smoother, as the device is most likely to scroll in the first
                // bunch of milliseconds anyway
                this.editorKernel.toolbar.hideTemporarily();
            }
        },

        initializeEventHandling: function() {
            var com = CUI.rte.Common;
            var sel = CUI.rte.Selection;
            var self = this;
            var editContext = this.editorKernel.getEditContext();
            var body = editContext.doc.body;
            var $body = $(body);
            var $uiBody = $(document.body);
            // temporary focus handling - we need to retransfer focus immediately
            // to the text container (at least in iOS 6) to prevent the keyboard from
            // disappearing and losing the focus altogether
            $body.on("focus.rte", ".rte-toolbar-item", function(e) {
                self.$textContainer.focus();
                e.stopPropagation();
                e.preventDefault();
            });
            this.$textContainer.finger("blur.rte", function(e) {
                if (!self.editorKernel.isLocked()) {
                    // get back in a few milliseconds and see if it was a temporary focus
                    // change (if a toolbar button was invoked) and finish otherwise -
                    // this is the case on mobile devices if the on-screen keyboard gets
                    // hidden
                    CUI.rte.Utils.defer(function() {
                        if (!self.isTemporaryFocusChange && self.isActive
                                && !self.editorKernel.isLocked()) {
                            self.finish(false);
                        }
                        self.isTemporaryFocusChange = false;
                    }, 10);
                } else {
                    self.isTemporaryFocusChange = false;
                }
            });
            // Prevent changing the selection on touch devices when the editor is locked
            // (and the user is editing a dialog) - the "mask" implementation used on
            // desktop does not work as expected; SafariMobile does interesting things with
            // the mask switched on (for example, masks the dialog and allows editing
            // - despite the mask has a much higher z-index - instead of vice versa).
            this.$textContainer.finger("touchstart.rte", function(e) {
                if (self.editorKernel.isLocked()) {
                    CUI.rte.UIUtils.killEvent(e);
                }
            });
            // additional keyboard handling
            CUI.rte.Eventing.on(editContext, body, "keyup", this.handleKeyUp, this);
            // handle clicks/taps (clicks on the editable div vs. common/"out of area"
            // clicks vs. clicks on toolbar items)
            this.$textContainer.fipo("tap.rte", "click.rte", function(e) {
                if (!self.editorKernel.isLocked()) {
                    self._hidePopover();
                }
                e.stopPropagation();
            });
            var bookmark;
            $body.fipo("touchstart.rte-ooa", "mousedown.rte-ooa", function(e) {
                // we need to save the bookmark as soon as possible, as it gets lost
                // somewhere in the event handling between the initial touchstart/mousedown
                // event and the tap/click event where we actually might need it
                var context = self.editorKernel.getEditContext();
                bookmark = sel.createRangeBookmark(context);
            });
            $body.fipo("tap.rte-ooa", "click.rte-ooa", function(e) {
                // there are cases where "out of area clicks" must be ignored - for example,
                // on touch devices, the initial tap is followed by a click event that
                // would stop editing immediately; so the ignoreNextClick flag may be
                // used to handle those cases
                if (self.ignoreNextClick) {
                    self.ignoreNextClick = false;
                    return;
                }
                // also ignore if editing is currently locked
                if (self.editorKernel.isLocked()) {
                    return;
                }
                // TODO find a cleaner solution ...
                if (self._hidePopover()) {
                    var context = self.editorKernel.getEditContext();
                    self.editorKernel.focus(context);
                    // restore the bookmark that was saved on the initial
                    // touchstart/mousedown event
                    if (bookmark) {
                        sel.selectRangeBookmark(context, bookmark);
                        bookmark = undefined;
                    }
                    self.isTemporaryFocusChange = true;
                    CUI.rte.UIUtils.killEvent(e);
                } else if (self.isActive) {
                    self.finish(false);
                    self.$textContainer.blur();
                }
            });
            $body.finger("tap.rte-ooa", CUI.rte.UIUtils.killEvent);
            // prevent losing focus for toolbar items
            $uiBody.fipo("tap.rte-item", "click.rte-item", ".rte-toolbar .item",
                    function(e) {
                        self.isTemporaryFocusChange = true;
                        CUI.rte.UIUtils.killEvent(e);
                    });
            // prevent losing focus for popovers
            $uiBody.fipo("tap.rte-item", "click.rte-item", ".rte-popover .item",
                    function(e) {
                        self.isTemporaryFocusChange = true;
                        CUI.rte.UIUtils.killEvent(e);
                    });
            // hide toolbar/popover while a selection is created
            this._handleToolbarOnSelectionChange();
        },

        deactivateEditorKernel: function() {
            if (this.editorKernel != null) {
                this.editorKernel.removeUIListener("requestClose");
                this.editorKernel.removeUIListener("updatestate");
                this.editorKernel.suspendEventHandling();
                this.editorKernel.destroyToolbar();
            }
        },

        finalizeEventHandling: function() {
            if (this.editorKernel != null) {
                var context = this.editorKernel.getEditContext();
                var body = context.doc.body;
                var $body = $(body);
                var $uiBody = $(document.body);
                var $doc = $(context.doc);
                // Widget
                CUI.rte.Eventing.un(body, "keyup", this.handleKeyUp, this);
                this.$textContainer.off("blur.rte touchstart.rte tap.rte click.rte");
                $body.off("focus.rte tap.rte-ooa click.rte-ooa");
                $body.off("touchstart.rte-ooa mousedown.rte-ooa");
                // Toolbar
                $uiBody.off("tap.rte-item click.rte-item");
                this.$textContainer.off("mousemove.rte-toolbarhide");
                this.$textContainer.off(
                        "mouseup.rte-toolbarhide mousedown.rte-toolbarhide");
                $doc.off("selectionchange.rte-toolbarhide");
            }
        },

        updateState: function() {
            this.editorKernel.updateToolbar();
        },


        // Interface -----------------------------------------------------------------------

        /**
         * Gets the current content of the edited text <i>while editing is in progress</i>.
         * Returns undefined before/after editing is started/has been finished.
         * @returns {String} The edited content; undefined if content is not being edited
         *          at the moment
         */
        getContent: function() {
            if (!this.isActive) {
                return undefined;
            }
            return this.editorKernel.getProcessedHtml();
        },

        start: function(config) {
            if (this.editorKernel === null) {
                this.editorKernel = new CUI.rte.DivKernel(config,
                        function(plugin, feature) {
                            if (plugin === "control") {
                                return (feature === "close");
                            }
                            return undefined;
                        });
            }
            var ua = CUI.rte.Common.ua;
            this.ignoreNextClick = ua.isTouch;
            this.$textContainer = this.getTextDiv(this.$element);
            this.$textContainer.addClass("edited");
            this.textContainer = this.$textContainer[0];
            this.editorKernel.createToolbar({
                "$editable": this.$element,
                "uiSettings": (config ? config.uiSettings : undefined)
            });
            /*
            this.currentSize = this.textContainer.getSize();
            var pos = el.getXY();
            this.currentPosition = {
                "x": pos[0],
                "y": pos[1]
            };
            */
            // if the component includes the "empty text placeholder", the placeholder
            // has to be removed and prepared for richtext editing
            this.isEmptyContent = this.isEmptyText();
            if (this.isEmptyContent) {
                this.prepareForNewText();
            }
            var initialContent = this.options.initialContent;
            if (initialContent === undefined) {
                initialContent = this.$textContainer.html();
            }
            this.$textContainer[0].contentEditable = "true";
            if (ua.isGecko || ua.isWebKit) {
                this.savedOutlineStyle = this.textContainer.style.outlineStyle;
                this.textContainer.style.outlineStyle = "none";
            }
            this.initializeEditorKernel(initialContent);
            var context = this.editorKernel.getEditContext();
            var body = context.doc.body;
            this.savedSpellcheckAttrib = body.spellcheck;
            body.spellcheck = false;
            this.initializeEventHandling();
            this.isActive = true;
            this.$element.trigger("editing-start");
        },

        finish: function(isCancelled) {
            var context = this.editorKernel.getEditContext();
            var body = context.doc.body;
            var editedContent = this.editorKernel.getProcessedHtml();
            CUI.rte.Selection.resetSelection(context, "start");
            this.finalizeEventHandling();
            this.deactivateEditorKernel();
            this.$textContainer.removeClass("edited");
            this.textContainer.blur();
            this.textContainer.contentEditable = "inherit";
            body.spellcheck = this.savedSpellcheckAttrib;
            var ua = CUI.rte.Common.ua;
            if ((ua.isGecko || ua.isWebKit) && this.savedOutlineStyle) {
                this.textContainer.style.outlineStyle = this.savedOutlineStyle;
            }
            this.isActive = false;
            this.$element.trigger(isCancelled ? "editing-cancelled" : "editing-finished",
                    [ editedContent ]);
            return editedContent;
        }

    });

    // Register ...
    CUI.util.plugClass(CUI.RichText, "richEdit", function(rte) {
        CUI.rte.ConfigUtils.loadConfigAndStartEditing(rte, $(this));
    });

    // Data API
    if (CUI.options.dataAPI) {
        $(function () {
            $('body').fipo('tap.rte.data-api', 'click.rte.data-api', '.editable',
                    function (e) {
                        var $this = $(this);
                        if (!$this.hasClass("edited")) {
                            $this.richEdit();
                            e.preventDefault();
                        }
                    });
        });
    }

}(window.jQuery));

/*************************************************************************
*
* ADOBE CONFIDENTIAL
* ___________________
*
*  Copyright 2013 Adobe Systems Incorporated
*  All Rights Reserved.
*
* NOTICE:  All information contained herein is, and remains
* the property of Adobe Systems Incorporated and its suppliers,
* if any.  The intellectual and technical concepts contained
* herein are proprietary to Adobe Systems Incorporated and its
* suppliers and are protected by trade secret or copyright law.
* Dissemination of this information or reproduction of this material
* is strictly forbidden unless prior written permission is obtained
* from Adobe Systems Incorporated.
**************************************************************************/

(function() {
    CUI.rte.ui.ToolkitRegistry.initialize("cui");
})();