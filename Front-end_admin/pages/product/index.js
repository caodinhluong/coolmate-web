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
        id: null,
        name: '',
        mota: '',
        price: 0,
        category_id: null,
        image_url: '',
        title: '',
        supplier_id: null,
    };

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]); // State để lưu danh sách danh mục
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

    // Lấy danh sách sản phẩm và danh mục khi component mount
    useEffect(() => {
        productService.getProducts()
            .then((data) => setProducts(data))
            .catch((error) => {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000 });
            });

        productService.getCategories()
            .then((data) => setCategories(data))
            .catch((error) => {
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

        if (product.name.trim()) {
            let _product = { ...product };
            try {
                if (product.id) {
                    await productService.updateProduct(_product);
                    const updatedProducts = products.map((p) => (p.id === _product.id ? _product : p));
                    setProducts(updatedProducts);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật sản phẩm', life: 3000 });
                } else {
                    const newProduct = await productService.createProduct(_product);
                    setProducts([...products, newProduct]);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo sản phẩm', life: 3000 });
                }
                setProductDialog(false);
                setProduct(emptyProduct);
            } catch (error) {
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu sản phẩm', life: 3000 });
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
            await productService.deleteProduct(product.id);
            const updatedProducts = products.filter((val) => val.id !== product.id);
            setProducts(updatedProducts);
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa sản phẩm', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa sản phẩm', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        try {
            const selectedIds = selectedProducts.map((p) => p.id);
            await Promise.all(selectedIds.map((id) => productService.deleteProduct(id)));
            const updatedProducts = products.filter((val) => !selectedIds.includes(val.id));
            setProducts(updatedProducts);
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các sản phẩm', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa các sản phẩm', life: 3000 });
        }
    };

    const onInputChange = (e, name) => {
        const val = e.target?.value || '';
        setProduct((prevProduct) => ({ ...prevProduct, [name]: val }));
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        setProduct((prevProduct) => ({ ...prevProduct, [name]: val }));
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
            <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={() => dt.current.exportCSV()} />
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
        const imageString = rowData.image_url; // Sửa từ img_url thành image_url
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
                {category ? category.name : rowData.category_id || 'Không xác định'}
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
                        <Column field="name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Hình ảnh" body={imageBodyTemplate}></Column>
                        <Column field="price" header="Giá" sortable body={priceBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="category_id" header="Danh mục" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Chi tiết sản phẩm" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Tên</label>
                            <InputText id="name" value={product.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !product.name })} />
                            {submitted && !product.name && <small className="p-invalid">Tên là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="mota">Mô tả</label>
                            <InputTextarea id="mota" value={product.mota} onChange={(e) => onInputChange(e, 'mota')} rows={3} cols={20} />
                        </div>
                        <div className="field">
                            <label htmlFor="price">Giá</label>
                            <InputNumber id="price" value={product.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="VND" locale="vi-VN" />
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
                            <label htmlFor="image_url">URL ảnh (cách nhau bằng dấu phẩy)</label>
                            <InputText id="image_url" value={product.image_url} onChange={(e) => onInputChange(e, 'image_url')} />
                        </div>
                        <div className="field">
                            <label htmlFor="title">Tiêu đề</label>
                            <InputText id="title" value={product.title} onChange={(e) => onInputChange(e, 'title')} />
                        </div>
                        <div className="field">
                            <label htmlFor="supplier_id">Nhà cung cấp</label>
                            <InputText id="supplier_id" value={product.supplier_id || ''} onChange={(e) => onInputChange(e, 'supplier_id')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Bạn có chắc muốn xóa <b>{product.name}</b> không?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>Bạn có chắc muốn xóa các sản phẩm đã chọn không?</span>
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};
export default Product;