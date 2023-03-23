package com.devsuperior.dscatalog.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.devsuperior.dscatalog.entities.Product;
import com.devsuperior.dscatalog.projections.ProductProjection;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

	@Query(nativeQuery = true, value = """
		SELECT DISTINCT tb_product.*
		FROM tb_product
		INNER JOIN tb_product_category ON tb_product_category.product_id = tb_product.id
		WHERE (1=0 OR :categoryIds IS NULL OR tb_product_category.category_id IN :categoryIds)
		AND (LOWER(tb_product.name) LIKE LOWER(CONCAT('%',:name,'%')))
		ORDER BY tb_product.name
		""",
		countQuery = """
		SELECT COUNT(*) FROM (
		SELECT DISTINCT tb_product.*
		FROM tb_product
		INNER JOIN tb_product_category ON tb_product_category.product_id = tb_product.id
		WHERE (1=0 OR :categoryIds IS NULL OR tb_product_category.category_id IN :categoryIds)
		AND (LOWER(tb_product.name) LIKE LOWER(CONCAT('%',:name,'%')))
		) as tb_prods
		""")
	Page<ProductProjection> searchProducts(List<Long> categoryIds, String name, Pageable pageable);

	@Query("SELECT obj FROM Product obj JOIN FETCH obj.categories WHERE obj.id IN :productIds")
	List<Product> searchProductsWithCategories(List<Long> productIds);
}
