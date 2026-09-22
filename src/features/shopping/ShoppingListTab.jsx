import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useReactToPrint } from 'react-to-print';
import { Card, Select, InputNumber, Button, Row, Col, Space } from 'antd';
import { makeSelectShoppingListForRecipe, selectShoppingListForPlan } from './selectors';
import PrintableList from './PrintableList';

export default function ShoppingListTab() {
  const recipes = useSelector((state) => state.recipes.items);
  const [listType, setListType] = useState('recipe'); // 'recipe' | 'plan'
  const [recipeId, setRecipeId] = useState();
  const [portions, setPortions] = useState(4);
  const [generated, setGenerated] = useState(null);

  const printRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef: printRef });

  const selectForRecipe = makeSelectShoppingListForRecipe();
  const planGroups = useSelector(selectShoppingListForPlan);
  const recipeResult = useSelector((state) =>
    recipeId ? selectForRecipe(state, recipeId, portions) : null
  );

  const handleGenerate = () => {
    if (listType === 'recipe' && recipeResult) {
      setGenerated({ title: `${recipeResult.recipeName} — ${portions} portions`, groups: recipeResult.groups });
    } else if (listType === 'plan') {
      setGenerated({ title: 'Liste de courses — planning du mois', groups: planGroups });
    }
  };

  return (
    <Card title="Générer une liste">
      <Row gutter={[16, 12]} align="bottom">
        <Col xs={24} sm={12} md={6}>
          <label>Type de liste</label>
          <Select
            value={listType}
            onChange={setListType}
            style={{ width: '100%' }}
            options={[
              { label: 'Par recette seule', value: 'recipe' },
              { label: 'Planning entier', value: 'plan' },
            ]}
          />
        </Col>

        {listType === 'recipe' && (
          <>
            <Col xs={24} sm={12} md={8}>
              <label>Recette</label>
              <Select
                placeholder="Choisir une recette"
                value={recipeId}
                onChange={setRecipeId}
                style={{ width: '100%' }}
                options={recipes.map((r) => ({ label: r.name.toUpperCase(), value: r.id }))}
              />
            </Col>
            <Col xs={12} sm={8} md={4}>
              <label>Portions voulues</label>
              <InputNumber min={1} value={portions} onChange={setPortions} style={{ width: '100%' }} />
            </Col>
          </>
        )}

        <Col xs={24} style={{ marginTop: 8 }}>
          <Space wrap>
            <Button type="primary" danger onClick={handleGenerate}>
              Générer la liste
            </Button>
            <Button onClick={handlePrint} disabled={!generated}>
              Imprimer / PDF
            </Button>
          </Space>
        </Col>
      </Row>

      {generated && (
        <div style={{ marginTop: 24, border: '1px solid #f0f0f0' }}>
          <PrintableList ref={printRef} title={generated.title} groups={generated.groups} />
        </div>
      )}
    </Card>
  );
}
