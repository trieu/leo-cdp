<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

/**
 * page_decorator
 */
class page_decorator {
    protected $CI;
    protected $pageTitle = "";
    protected $pageFooter = "";
    protected $pageMetaTags = array();
    protected $scriptFiles = array();
    protected $cssFiles = array();

    /**
     * __construct
     *
     * @return void
     * @author Trieu Nguyen
     * */
    public function __construct() {
        $this->CI = & get_instance();
        $pageMetaTags = array();
    }

    public function setPageMetaTag($name, $content) {
        $this->pageMetaTags[$name] = $content;
    }

    public function getPageMetaTags() {
        return $this->pageMetaTags;
    }

    public function getPageTitle() {        
        return lang('home_page_heading') . " - " . $this->pageTitle;;
    }

    public function setPageTitle($pageTitle) {
        $pageTitle = show_the_excerpt(trim($pageTitle), 12);
        $this->pageTitle = $pageTitle;
    }

    public function getPageFooter() {
        return $this->pageFooter;
    }

    public function setPageFooter($pageFooter) {
        $this->pageFooter = $pageFooter;
    }

    public function getScriptFiles() {
        return $this->scriptFiles;
    }

    public function addScriptFile($relative_path) {
        array_push($this->scriptFiles, $relative_path);
    }

    public function addScriptFiles($relative_paths = array()) {
        $this->scriptFiles = $relative_paths;
    }

    public function getCssFiles() {
        return $this->cssFiles;
    }

    public function addCssFile($relative_path) {
        array_push($this->cssFiles, $relative_path);
    }

    public function addCssFiles($relative_paths = array()) {
        $this->cssFiles = $relative_paths;
    }

}
