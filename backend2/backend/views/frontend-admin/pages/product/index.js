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
import { ProductService } from '../../service/ProductService';

const Product = () => {
    let emptyProduct = {
        product_id: null,
        product_name: '',
        brand_id: null,
        category_id: null,
        price: 0,
        discount_price: null,
        description: '',
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
        loadProducts();
        loadCategories();
    }, []);

    const loadProducts = () => {
        productService
            .getAllProducts()
            .then((data) => {
                console.log('Danh sách sản phẩm:', data);
                setProducts(data || []);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách sản phẩm:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách sản phẩm', life: 3000 });
            });
    };

    const loadCategories = () => {
        productService
            .getCategories({ limit: 100, page: 1 }) // Lấy đủ danh mục để hiển thị trong dropdown
            .then((result) => {
                console.log('Danh sách danh mục:', result);
                setCategories(result.data || []);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách danh mục:', error);
                toast.current.show({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách danh mục', life: 3000 });
            });
    };

    const formatCurrency = (value) => {
        return value ? value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0 đ';
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

        if (product.product_name.trim() && product.category_id) {
            let _product = { ...product };
            try {
                if (_product.product_id) {
                    console.log('Cập nhật sản phẩm:', _product);
                    await productService.updateProduct(_product);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã cập nhật sản phẩm', life: 3000 });
                } else {
                    console.log('Tạo sản phẩm mới:', _product);
                    const newProduct = await productService.createProduct(_product);
                    setProducts([...products, newProduct]);
                    toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã tạo sản phẩm', life: 3000 });
                }
                loadProducts(); // Tải lại danh sách sản phẩm
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
            loadProducts();
            setDeleteProductDialog(false);
            setProduct(emptyProduct);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa sản phẩm', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa:', error);
            toast.current.show({ severity: 'error', summary: 'Lỗi', detail: error.message || 'Không thể xóa sản phẩm', life: 3000 });
        }
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = async () => {
        try {
            const deletePromises = selectedProducts.map((p) => productService.deleteProduct(p.product_id));
            await Promise.all(deletePromises);
            loadProducts();
            setDeleteProductsDialog(false);
            setSelectedProducts(null);
            toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa các sản phẩm đã chọn', life: 3000 });
        } catch (error) {
            console.error('Lỗi khi xóa nhiều sản phẩm:', error);
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
        return <Button label="Xuất CSV" icon="pi pi-upload" severity="help" onClick={() => dt.current.exportCSV()} />;
    };

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Tên</span>
                {rowData.product_name}
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

    const discountPriceBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Giá giảm</span>
                {formatCurrency(rowData.discount_price)}
            </>
        );
    };

    const categoryBodyTemplate = (rowData) => {
        const category = categories.find((cat) => cat.category_id === rowData.category_id);
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
                        dataKey="product_id"
                        className="datatable-responsive"
                        globalFilter={globalFilter}
                        emptyMessage="Không tìm thấy sản phẩm."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="product_name" header="Tên" sortable body={nameBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Giá" sortable body={priceBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="discount_price" header="Giá giảm" sortable body={discountPriceBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="category_id" header="Danh mục" sortable body={categoryBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Chi tiết sản phẩm" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        {product.product_id && (
                            <div className="field">
                                <label htmlFor="product_id">Mã sản phẩm</label>
                                <InputText id="product_id" value={product.product_id} disabled />
                            </div>
                        )}
                        <div className="field">
                            <label htmlFor="product_name">Tên sản phẩm</label>
                            <InputText
                                id="product_name"
                                value={product.product_name}
                                onChange={(e) => onInputChange(e, 'product_name')}
                                required
                                autoFocus={!product.product_id}
                                className={classNames({ 'p-invalid': submitted && !product.product_name })}
                            />
                            {submitted && !product.product_name && <small className="p-invalid">Tên sản phẩm là bắt buộc.</small>}
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
                                className={classNames({ 'p-invalid': submitted && !product.price })}
                            />
                            {submitted && !product.price && <small className="p-invalid">Giá là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="discount_price">Giá giảm</label>
                            <InputNumber
                                id="discount_price"
                                value={product.discount_price || null}
                                onValueChange={(e) => onInputNumberChange(e, 'discount_price')}
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
                                options={categories.map((cat) => ({ label: cat.category_name, value: cat.category_id }))}
                                onChange={(e) => onInputChange(e, 'category_id')}
                                placeholder="Chọn danh mục"
                                className={classNames({ 'p-invalid': submitted && !product.category_id })}
                            />
                            {submitted && !product.category_id && <small className="p-invalid">Danh mục là bắt buộc.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="brand_id">Thương hiệu</label>
                            <InputText id="brand_id" value={product.brand_id || ''} onChange={(e) => onInputChange(e, 'brand_id')} />
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Bạn có chắc muốn xóa <b>{product.product_name}</b> không?
                                </span>
                            )}
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