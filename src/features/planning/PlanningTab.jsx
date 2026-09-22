import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Input, Button, Collapse, Select, InputNumber, Row, Col, Empty, Space, Popconfirm } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { setMonthLabel, addWeek, removeWeek, addDayEntry, removeDayEntry } from '../../store/planSlice';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export default function PlanningTab() {
  const dispatch = useDispatch();
  const { monthLabel, weeks } = useSelector((state) => state.plan);
  const recipes = useSelector((state) => state.recipes.items);
  const [monthInput, setMonthInput] = useState(monthLabel);

  return (
    <Card title="Planning du mois">
      <Row gutter={16} align="bottom" style={{ marginBottom: 24 }}>
        <Col span={8}>
          <label>Mois planifié</label>
          <Input
            placeholder="Ex. Octobre 2026"
            value={monthInput}
            onChange={(e) => setMonthInput(e.target.value)}
          />
        </Col>
        <Col>
          <Button type="primary" danger onClick={() => dispatch(setMonthLabel(monthInput))}>
            Enregistrer le mois
          </Button>
        </Col>
      </Row>

      {weeks.length === 0 && (
        <Empty description="Pas encore de semaine — clique sur « Ajouter une semaine » pour commencer le planning du mois." />
      )}

      <Collapse style={{ marginBottom: 16 }}>
        {weeks.map((week) => (
          <Collapse.Panel
            header={week.label}
            key={week.id}
            extra={
              <Popconfirm title="Supprimer cette semaine ?" onConfirm={() => dispatch(removeWeek(week.id))}>
                <DeleteOutlined onClick={(e) => e.stopPropagation()} />
              </Popconfirm>
            }
          >
            <WeekEditor weekId={week.id} days={week.days} recipes={recipes} />
          </Collapse.Panel>
        ))}
      </Collapse>

      <Button icon={<PlusOutlined />} onClick={() => dispatch(addWeek())}>
        Ajouter une semaine
      </Button>
    </Card>
  );
}

function WeekEditor({ weekId, days, recipes }) {
  const dispatch = useDispatch();
  const [dayLabel, setDayLabel] = useState(DAYS[0]);
  const [recipeId, setRecipeId] = useState();
  const [portions, setPortions] = useState(4);

  const handleAdd = () => {
    if (!recipeId) return;
    dispatch(addDayEntry({ weekId, dayLabel, recipeId, portions }));
  };

  return (
    <>
      {days.map((d) => {
        const recipe = recipes.find((r) => r.id === d.recipeId);
        return (
          <Row key={d.id} justify="space-between" style={{ marginBottom: 8 }}>
            <Col>
              {d.dayLabel} — {recipe ? recipe.name : '(recette supprimée)'} ({d.portions} portions)
            </Col>
            <Col>
              <DeleteOutlined onClick={() => dispatch(removeDayEntry({ weekId, dayId: d.id }))} />
            </Col>
          </Row>
        );
      })}

      <Space style={{ marginTop: 12 }}>
        <Select value={dayLabel} onChange={setDayLabel} options={DAYS.map((d) => ({ label: d, value: d }))} style={{ width: 120 }} />
        <Select
          placeholder="Choisir une recette"
          value={recipeId}
          onChange={setRecipeId}
          options={recipes.map((r) => ({ label: r.name, value: r.id }))}
          style={{ width: 220 }}
        />
        <InputNumber min={1} value={portions} onChange={setPortions} addonAfter="portions" />
        <Button onClick={handleAdd}>Ajouter</Button>
      </Space>
    </>
  );
}
