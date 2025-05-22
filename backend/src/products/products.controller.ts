import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/products.dto';

@Controller('api/products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAllProducts();
  }

  @Get(':productId')
  async findOne(@Param('productId') productId: string) {
    return this.productsService.findOneProduct(productId);
  }

  @Post('/create')
  async create(@Body() data: CreateProductDto) {
    return this.productsService.createProduct(data);
  }

  @Put('/update/:productId')
  async update(
    @Param('productId') productId: string,
    @Body() data: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(productId, data);
  }

  @Delete('/delete/:productId')
  async remove(@Param('productId') productId: string) {
    return this.productsService.deleteProduct(productId);
  }
}
