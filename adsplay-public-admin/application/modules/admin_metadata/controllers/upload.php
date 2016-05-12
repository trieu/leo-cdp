<?php

if (!defined('BASEPATH'))
    exit('No direct script access allowed');

class Upload extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
        $this->controllerName = $this->router->fetch_class();
        $this->methodName = $this->router->fetch_method();
        $this->load->Model("media_file");

    }

    /**
     * @Secured(role = "operator")
     */
    public function do_tvc_video_ads_upload()
    {

        $target_dir = "uploads/";
        $data = array();

        if ($this->input->server('REQUEST_METHOD') == 'GET') {
            $output = "Bad method input";
        } else if ($this->input->server('REQUEST_METHOD') === 'POST') {
            $target_file = $target_dir . basename($_FILES["userfile"]["name"]);
//            $checkFile = md5_file( base_url($target_file));
//            $ext = explode('.',$_FILES["userfile"]["name"]);
//            $config['file_name'] = $checkFile.'.'.$ext[1];
            $uploadOk = 1;
            // Check if file already exists
            if (!isset($_POST["token"]) || $_POST["token"] !== '123456') {
                $data['error_message'] = "Sorry, bad upload token";
                $uploadOk = 0;
            }
//             Check if file already exists
            if (file_exists($target_file)) {
                $data['error_message'] = "Sorry, file already exists.";
                $uploadOk = 0;
            }
            // Check file size
            if ($_FILES["userfile"]["size"] > 10000000) {
                $data['error_message'] = "Sorry, your file is too large.";
                $uploadOk = 0;
            }
//             Check if $uploadOk is set to 0 by an error
            if ($uploadOk == 0) {
                if (!isset($data['error_message'])) {
                    $data['error_message'] = "Sorry, your file was not uploaded.";
                }
                // if everything is ok, try to upload file
            } else {
                $this->load->helper(array('form', 'url'));
                $config['upload_path'] = 'uploads';
                $config['allowed_types'] = 'gif|jpg|png|mp4';
                $config['max_size'] = '10000000';

                $this->load->library('upload', $config);
                $this->upload->initialize($config);

                $this->load->library('upload', $config);
                $this->upload->initialize($config);

                if (!$this->upload->do_upload()) {
                    $data['error_message'] = $this->upload->display_errors();
                } else {
                    $dataUpload = array('upload_data' => $this->upload->data());
                    $type = $dataUpload['upload_data']['file_type'];
                    $typeUpload = explode("/", $type);
//                    $uri = "/uploads/" . basename($dataUpload['upload_data']['file_name']);
//                    $ext = explode('.',$dataUpload['upload_data']['file_name']);

//                    echo 'MD5 file hash of ' . $dataUpload['upload_data']['file_name'] . ': ' . md5_file( base_url($uri));
//                    if(file_exists($checkFile)){
//                      $fileName = md5_file( base_url($uri));
                    $dataCreative = array(
                        "path" => $dataUpload['upload_data']['file_name'],
                        "type" => $typeUpload[0],
                        "size" => $dataUpload['upload_data']['file_size']
                    );
                    $statusUpload = $this->media_file->addMediaFile($dataCreative);
//                    $uri = "/uploads/" . basename($data123['upload_data']['file_name']);
//                    $data['tvc_mp4_url'] = base_url($uri);
                    if ($statusUpload)
                        $data['status'] = "Upload Successful!";
                    else
                        $data['status'] = "Please try again!";

                }
            }
        }
        $this->load->view("iframe/tvc-video-upload-ok", $data);
    }

    /**
     * @Decorated
     * @Secured(role = "operator")
     */
    public function test_upload()
    {
        $data = array();
        $this->load->view("iframe/upload-tvc-video-ads", $data);
    }

    /**
     * @Secured(role = "operator")
     */
    public function upload_iframe()
    {

        $data = array('iframe' => TRUE);
        $this->load->view("iframe/upload-tvc-video-ads", $data);
    }
}
