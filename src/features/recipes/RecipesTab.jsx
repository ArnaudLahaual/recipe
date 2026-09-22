import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Form, Input, InputNumber, Select, Button, List, Typography, Space, Popconfirm, Row, Col } from 'antd';
import { PlusOutlined, MinusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { addRecipe, removeRecipe, INGREDIENT_CATEGORIES } from '../../store/recipesSlice';

const { Title, Text } = Typography;

export default function RecipesTab() {
  const dispatch = useDispatch();
  const recipes = useSelector((state) => state.recipes.items);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    dispatch(
      addRecipe({
        name: values.name,
        basePortions: values.basePortions,
        ingredients: values.ingredients || [],
      })
    );
    form.resetFields();
  };

  return (
    <Row gutter={24}>
      <Col span={14}>
        <Card title="Nouvelle recette">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ basePortions: 4, ingredients: [{}, {}] }}
          >
            <Row gutter={16}>
              <Col span={16}>
                <Form.Item
                  name="name"
                  label="Nom du plat"
                  rules={[{ required: true, message: 'Nom requis' }]}
                >
                  <Input placeholder="Ex. Poulet rôti, légumes racines" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="basePortions"
                  label="Portions de base"
                  rules={[{ required: true }]}
                >
                  <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>

            <Text strong>Ingrédients (pour cette base de portions)</Text>
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Row gutter={8} key={key} style={{ marginTop: 8 }} align="middle">
                      <Col span={7}>
                        <Form.Item {...rest} name={[name, 'name']} noStyle rules={[{ required: true, message: 'Nom' }]}>
                          <Input placeholder="Ingrédient (ex. carottes)" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...rest} name={[name, 'qty']} noStyle rules={[{ required: true, message: 'Qté' }]}>
                          <InputNumber placeholder="Qté" style={{ width: '100%' }} min={0} />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...rest} name={[name, 'unit']} noStyle>
                          <Input placeholder="unité (g, pièce...)" />
                        </Form.Item>
                      </Col>
                      <Col span={7}>
                        <Form.Item {...rest} name={[name, 'category']} noStyle initialValue="Fruits & légumes">
                          <Select options={INGREDIENT_CATEGORIES.map((c) => ({ label: c, value: c }))} />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Col>
                    </Row>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    style={{ marginTop: 12 }}
                  >
                    Ajouter un ingrédient
                  </Button>
                </>
              )}
            </Form.List>

            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit" danger>
                Enregistrer la recette
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>

      <Col span={10}>
        <Card title="Mes recettes">
          <List
            dataSource={recipes}
            locale={{ emptyText: 'Aucune recette pour le moment' }}
            renderItem={(recipe) => (
              <List.Item
                actions={[
                  <Popconfirm
                    key="del"
                    title="Supprimer cette recette ?"
                    onConfirm={() => dispatch(removeRecipe(recipe.id))}
                  >
                    <Button danger type="text" icon={<DeleteOutlined />} />
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={recipe.name.toUpperCase()}
                  description={`${recipe.ingredients.length} ingrédient(s) · base ${recipe.basePortions} portions`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
    </Row>
  );
}
