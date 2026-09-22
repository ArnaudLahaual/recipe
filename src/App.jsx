import { Typography, Tabs, Layout } from 'antd';
import RecipesTab from './features/recipes/RecipesTab';
import PlanningTab from './features/planning/PlanningTab';
import ShoppingListTab from './features/shopping/ShoppingListTab';

const { Title, Text } = Typography;

export default function App() {
  return (
    <Layout className="popote-layout" style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ marginBottom: 16 }}>
        <Title level={2} className="popote-title" style={{ fontFamily: 'Georgia, serif', color: '#a63d2f', marginBottom: 0 }}>
          Popote &amp; Cie — Planning
        </Title>
        <Text type="secondary">Recettes, mois et listes de courses</Text>
      </div>

      <Tabs
        defaultActiveKey="recipes"
        items={[
          { key: 'recipes', label: 'Recettes', children: <RecipesTab /> },
          { key: 'planning', label: 'Planning du mois', children: <PlanningTab /> },
          { key: 'shopping', label: 'Liste de courses', children: <ShoppingListTab /> },
        ]}
      />
    </Layout>
  );
}
