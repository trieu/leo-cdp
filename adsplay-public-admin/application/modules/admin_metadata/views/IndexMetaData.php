<ul class="nav nav-tabs" id="MetaDataTab">
    <li class="active"><a data-target="#brand" data-toggle="tab">Brand</a></li>
    <li><a data-target="#product" data-toggle="tab">Product</a></li>
    <li><a data-target="#sectors" data-toggle="tab">Sectors</a></li>

</ul>

<div class="tab-content">
    <div class="tab-pane active" id="brand">
        <?php $this->load->view('admin_metadata/brand/List_Brand');?>
    </div>

    <div class="tab-pane" id="product">
        <?php $this->load->view('admin_metadata/product/List_Product');?>
    </div>

    <div class="tab-pane" id="sectors">
        <?php $this->load->view('admin_metadata/sector/List_Sector');?>
    </div>

</div>