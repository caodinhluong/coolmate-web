import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import { ProductService } from '../../demo/service/ProductService';

const Product = () => {
    let emptyProduct = {
        product_id: null,
        name: '',
        description: '',
        price: 0,
        category_id: null,
        image_url: '',
        title: '',
        supplier_id: null,
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const productService = new ProductService();

    useEffect(() => {
        productService.getProducts()
            .then((data) => {
                console.log('Danh sách sản phẩm:', data);
                setProducts(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000 });
            });

        productService.getCategories()
            .then((data) => {
                console.log('Danh sách danh mục:', data);
                setCategories(data);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách danh mục:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách danh mục', life: 3000 });
            });
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
    };

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = async () => {
        setSubmitted(true);

        if (product.name.trim() && product.category_id) {
            try {
                if (product.id) {
                    console.log('Cập nhật sản phẩm:', product);
                    await productService.updateProduct(product);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật sản phẩm', life: 3000 });
                } else {
                    console.log('Tạo sản phẩm mới:', product);
                    const newProduct = { ...product };
                    await productService.createProduct(newProduct);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo sản phẩm', life: 3000 });
                }
                const updatedProducts = await productService.getProducts();
                setProducts(updatedProducts);
                setProductDialog(false);
                setProduct(emptyProduct);
            } catch (error) {
                console.error('Lỗi khi lưu sản phẩm:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể lưu sản phẩm', life: 3000 });
            }
        }
    };

    const editProduct = (product) => {
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = async () => {
        try {
            console.log('Xóa sản phẩm với ID:', product.product_id);
            await productService.deleteProduct(product.product_id);
            const updatedProducts = await productService.getProducts();
            setProducts(updatedProducts);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa sản phẩm', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm', life: 3000 });
        }
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        try {
            const deletePromises = selectedProducts.map((prod) => productService.deleteProduct(prod.id));
            await Promise.all(deletePromises);
            const updatedProducts = await productService.getProducts();
            setProducts(updatedProducts);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các sản phẩm đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều sản phẩm:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các sản phẩm', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        setProduct((prev) => ({ ...prev, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct((prev) => ({ ...prev, [name]: val }));
    };

    const onFileChange = (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const fileNames = Array.from(files).map(file => file.name).join(',');
            setProduct((prev) => ({ ...prev, image_url: fileNames }));
        }
    };

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="Thêm mới" icon="pi pi-plus" severity="success" className="mr-2" onClick={openNew} />
                <Button label="Xóa" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
            </div>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={exportCSV} />
        );
    };

    const sttBodyTemplate = (rowData, { rowIndex }) => {
        return (
            <>
                <span className="p-column-title">STT</span>
                {rowIndex + 1}
            </>
        );
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên</span>
                {rowData.name}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        const imageString = rowData.image_url;
        const firstImage = imageString ? imageString.split(',')[0] : null;
        const imagePath = firstImage ? `/product/${firstImage}` : null;

        return (
            <>
                <span className="p-column-title">Hình ảnh</span>
                {imagePath ? (
                    <img src={imagePath} alt="Image" style={{ width: '60px', height: '80px' }} />
                ) : (
                    'Không có'
                )}
            </>
        );
    };

    const priceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giá</span>
                {formatCurrency(rowData.price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        const category = categories.find((cat) => cat.id === rowData.category_id);
        return (
            <>
                <span className="p-column-title">Danh mục</span>
                {category ? category.category_name : rowData.category_id || 'Không xác định'}
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Quản lý sản phẩm</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Hủy" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" text onClick={saveProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );

    const deleteProductsDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Hiển thị {first} đến {last} của {totalRecords} sản phẩm"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy sản phẩm."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column header="STT" sortable body={sttBodyTemplate} headerStyle={{ minWidth: '2rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Giá" sortable body={priceBodyTemplate} headerStyle={{ minWidth: '7rem' }} bodyStyle={{ textAlign: 'right' }}></Column>
                        <Column field="category_id" header="Danh mục" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Chi tiết sản phẩm" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.id && (
                            <div className="field">
                                <label htmlFor="id">Mã sản phẩm</label>
                                <InputText id="id" value={product.id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="name">Tên sản phẩm</label>
                            <InputText
                                id="name"
                                value={product.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus={!product.id}
                                className={classNames({ 'p-invalid': submitted && !product.name })}
                            />
                            {submitted && !product.name && <small className="p-invalid">Tên sản phẩm là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="description">Mô tả</label>
                            <InputTextarea id="description" value={product.description || ''} onChange={(e) => onInputChange(e, 'description')} rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Giá</label>
                            <InputNumber
                                id="price"
                                value={product.price}
                                onValueChange={(e) => onInputNumberChange(e, 'price')}
                                mode="currency"
                                currency="VND"
                                locale="vi-VN"
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="category_id">Danh mục</label>
                            <Dropdown
                                id="category_id"
                                value={product.category_id}
                                options={categories.map((cat) => ({ label: cat.name, value: cat.id }))}
                                onChange={(e) => onInputChange(e, 'category_id')}
                                placeholder="Chọn danh mục"
                                className={classNames({ 'p-invalid': submitted && !product.category_id })}
                            />
                            {submitted && !product.category_id && <small className="p-invalid">Danh mục là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="images">Chọn ảnh</label>
                            <input
                                type="file"
                                id="images"
                                multiple
                                accept="image/*"
                                onChange={onFileChange}
                                style={{ display: 'block', marginTop: '5px' }}
                            />
                            {product.image_url && (
                                <small className="p-help">Đã chọn: {product.image_url}</small>
                            )}
                        </div>
                        <div className="field">
                            <label htmlFor="title">Tiêu đề</label>
                            <InputText id="title" value={product.title || ''} onChange={(e) => onInputChange(e, 'title')} />
                        </div>
                        <div className="field">
                            <label htmlFor="supplier_id">Nhà cung cấp</label>
                            <InputText id="supplier_id" value={product.supplier_id || ''} onChange={(e) => onInputChange(e, 'supplier_id')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>Bạn có chắc chắn muốn xóa sản phẩm <b>{product.name}</b> không?</span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc chắn muốn xóa các sản phẩm đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Product;